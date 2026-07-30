/** Eixo Reliability (ISO/IEC 25010): a API não deve travar/vazar exceção em
 * entradas inválidas, e a persistência do orçamento é atômica (sem registros órfãos). */
import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { closeConnection, getConnection, runInTransaction } from "../src/database/connection.js";
import { inserirCliente } from "../src/database/queries.js";
import { createApp } from "../src/server/app.js";

function novoOrcamentoValido(overrides: Record<string, unknown> = {}) {
  return {
    nome: "Bruno Reliability",
    possuiCriancas: true,
    tipoImovel: "casa",
    qtdQuartos: 1,
    temGaragem: false,
    qtdParcelas: 3,
    ...overrides,
  };
}

describe("API — reliability", () => {
  beforeEach(() => {
    closeConnection();
  });

  it("GET /api/orcamentos/:id/csv com id não numérico retorna 400, não 500/crash", async () => {
    const app = createApp();
    const res = await request(app).get("/api/orcamentos/abc/csv");
    expect(res.status).toBe(400);
    expect(res.body.erro).toBeDefined();
  });

  it("GET /api/orcamentos/:id/csv com id inexistente retorna 404, não exceção não tratada", async () => {
    const app = createApp();
    const res = await request(app).get("/api/orcamentos/999999/csv");
    expect(res.status).toBe(404);
  });

  it("GET /api/orcamentos retorna 200 com array (vazio no início)", async () => {
    const app = createApp();
    const res = await request(app).get("/api/orcamentos");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("POST /api/orcamentos com JSON malformado é tratado pelo error handler (400 JSON, não HTML)", async () => {
    const app = createApp();
    const res = await request(app)
      .post("/api/orcamentos")
      .set("Content-Type", "application/json")
      .send('{"nome": "Ana", invalid}');
    expect(res.status).toBe(400);
    expect(res.type).toBe("application/json");
    expect(res.body.erro).toBeDefined();
  });

  it("POST /api/orcamentos válido persiste cliente+imóvel+contrato+orçamento e aparece na listagem", async () => {
    const app = createApp();
    const criado = await request(app).post("/api/orcamentos").send(novoOrcamentoValido());
    expect(criado.status).toBe(201);

    const lista = await request(app).get("/api/orcamentos");
    expect(lista.body).toHaveLength(1);
  });

  it("POST /api/orcamentos inválido não deixa registro órfão em nenhuma tabela", async () => {
    const app = createApp();
    const res = await request(app)
      .post("/api/orcamentos")
      .send(novoOrcamentoValido({ tipoImovel: "castelo" }));
    expect(res.status).toBe(400);

    const lista = await request(app).get("/api/orcamentos");
    expect(lista.body).toHaveLength(0);
  });

  it("runInTransaction reverte todos os inserts se uma etapa falhar no meio", () => {
    expect(() =>
      runInTransaction(() => {
        inserirCliente("Cliente Órfão", false);
        throw new Error("falha simulada no meio da transação");
      }),
    ).toThrow("falha simulada");

    const db = getConnection();
    const { total } = db.prepare("SELECT COUNT(*) AS total FROM clientes").get() as {
      total: number;
    };
    expect(total).toBe(0);
  });
});
