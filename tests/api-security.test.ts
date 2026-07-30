/** Eixo Security (ISO/IEC 25010): injeção SQL, CSV/Formula Injection, payloads
 * abusivos e vazamento de detalhes internos em mensagens de erro. */
import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { closeConnection } from "../src/database/connection.js";
import { createApp } from "../src/server/app.js";

function novoOrcamentoValido(overrides: Record<string, unknown> = {}) {
  return {
    nome: "Carla Security",
    possuiCriancas: true,
    tipoImovel: "casa",
    qtdQuartos: 1,
    temGaragem: false,
    qtdParcelas: 3,
    ...overrides,
  };
}

describe("API — security", () => {
  beforeEach(() => {
    closeConnection();
  });

  it("nome de cliente com payload tipo SQL é persistido como texto literal (queries já parametrizadas)", async () => {
    const app = createApp();
    const payload = novoOrcamentoValido({ nome: "Robert'); DROP TABLE clientes;--" });
    const criado = await request(app).post("/api/orcamentos").send(payload);
    expect(criado.status).toBe(201);
    expect(criado.body.cliente).toBe(payload.nome);

    const lista = await request(app).get("/api/orcamentos");
    expect(lista.status).toBe(200);
    expect(lista.body).toHaveLength(1);
    expect(lista.body[0].clienteNome).toBe(payload.nome);
  });

  it("nome de cliente iniciado com '=' é neutralizado no CSV exportado (CSV/Formula Injection)", async () => {
    const app = createApp();
    const criado = await request(app)
      .post("/api/orcamentos")
      .send(novoOrcamentoValido({ nome: "=SUM(A1:A10)" }));
    expect(criado.status).toBe(201);

    const csv = await request(app).get(`/api/orcamentos/${criado.body.id}/csv`);
    expect(csv.status).toBe(200);
    expect(csv.text).toContain("'=SUM(A1:A10)");
    expect(csv.text).not.toMatch(/(^|,)=SUM/m);
  });

  it("payload JSON maior que o limite é rejeitado com 413, não 500 ou crash", async () => {
    const app = createApp();
    const nomeGigante = "a".repeat(200_000);
    const res = await request(app)
      .post("/api/orcamentos")
      .send(novoOrcamentoValido({ nome: nomeGigante }));
    expect(res.status).toBe(413);
    expect(res.body.erro).toBeDefined();
  });

  it("campos obrigatórios ausentes retornam 400 com mensagem genérica, sem stack trace", async () => {
    const app = createApp();
    const res = await request(app).post("/api/orcamentos").send({});
    expect(res.status).toBe(400);
    expect(res.body.erro).toBeDefined();
    expect(res.body.erro).not.toMatch(/at \w+|\.ts:\d+|node_modules/);
  });

  it("respostas incluem cabeçalhos de segurança do helmet", async () => {
    const app = createApp();
    const res = await request(app).get("/api/orcamentos");
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["x-powered-by"]).toBeUndefined();
  });
});
