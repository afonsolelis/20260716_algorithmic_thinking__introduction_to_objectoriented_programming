#!/usr/bin/env node
/**
 * Eixo Performance Efficiency (ISO/IEC 25010): carga contra a API real,
 * rodando via `npm run test:load` (start-server-and-test sobe o servidor
 * apontando para um DB_PATH isolado antes de disparar este script).
 */
import autocannon from "autocannon";

const BASE_URL = process.env.LOAD_TEST_URL ?? "http://localhost:3000";
// Concorrência modesta: node:sqlite (DatabaseSync) é síncrono e bloqueia o event loop
// por chamada — condizente com o perfil de uso real (ferramenta interna, não API pública
// de alto tráfego), não um benchmark de pico.
const CONNECTIONS = 10;
const DURATION_SEGUNDOS = 5;

const cenarios = [
  {
    nome: "POST /api/orcamentos",
    opts: {
      url: `${BASE_URL}/api/orcamentos`,
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        nome: "Carga Teste",
        possuiCriancas: true,
        tipoImovel: "casa",
        qtdQuartos: 1,
        temGaragem: false,
        qtdParcelas: 3,
      }),
      connections: CONNECTIONS,
      duration: DURATION_SEGUNDOS,
    },
    limiares: { p99Ms: 800, errosMax: 0 },
  },
  {
    nome: "GET /api/orcamentos",
    opts: {
      url: `${BASE_URL}/api/orcamentos`,
      connections: CONNECTIONS,
      duration: DURATION_SEGUNDOS,
    },
    limiares: { p99Ms: 800, errosMax: 0 },
  },
];

let algumCenarioFalhou = false;

for (const cenario of cenarios) {
  console.log(`\n=== Carga: ${cenario.nome} (${CONNECTIONS} conexões, ${DURATION_SEGUNDOS}s) ===`);
  const resultado = await autocannon(cenario.opts);

  const erros = resultado.errors + resultado.timeouts + resultado.non2xx;
  const p99 = resultado.latency.p99;

  console.log(`Requisições totais: ${resultado.requests.total} (${resultado.requests.average} req/s médio)`);
  console.log(
    `Latência p50/p95/p99: ${resultado.latency.p50}/${resultado.latency.p95}/${p99} ms`,
  );
  console.log(`Erros: ${resultado.errors}, timeouts: ${resultado.timeouts}, non-2xx: ${resultado.non2xx}`);

  let cenarioFalhou = false;
  if (erros > cenario.limiares.errosMax) {
    console.error(
      `❌ ${cenario.nome}: ${erros} erros/timeouts/non-2xx (limite: ${cenario.limiares.errosMax})`,
    );
    cenarioFalhou = true;
  }
  if (p99 > cenario.limiares.p99Ms) {
    console.error(`❌ ${cenario.nome}: p99 = ${p99}ms (limite: ${cenario.limiares.p99Ms}ms)`);
    cenarioFalhou = true;
  }
  if (cenarioFalhou) {
    algumCenarioFalhou = true;
  } else {
    console.log(`✅ ${cenario.nome}: dentro dos limiares.`);
  }
}

if (algumCenarioFalhou) {
  console.error("\nTeste de carga FALHOU: um ou mais cenários excederam os limiares.");
  process.exit(1);
}
console.log("\nTodos os cenários de carga dentro dos limiares.");
