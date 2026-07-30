/** RF05 — Cadastro de dados do cliente. */
import { describe, expect, it } from "vitest";
import { Cliente } from "../src/models/Cliente.js";

describe("Cliente", () => {
  it("getNome retorna o nome informado", () => {
    const cliente = new Cliente({ nome: "Maria Silva", possuiCriancas: true });
    expect(cliente.getNome()).toBe("Maria Silva");
  });

  it("getPossuiCriancas retorna true quando informado", () => {
    const cliente = new Cliente({ nome: "Maria Silva", possuiCriancas: true });
    expect(cliente.getPossuiCriancas()).toBe(true);
  });

  it("getPossuiCriancas retorna false quando informado", () => {
    const cliente = new Cliente({ nome: "João Souza", possuiCriancas: false });
    expect(cliente.getPossuiCriancas()).toBe(false);
  });
});
