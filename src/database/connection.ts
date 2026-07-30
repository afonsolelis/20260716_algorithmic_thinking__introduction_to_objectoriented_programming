/** Conexão SQLite — abre data/imobiliaria.db e aplica o schema de database/migration.sql. */
import { DatabaseSync } from "node:sqlite";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raizProjeto = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const caminhoBanco = join(raizProjeto, "data", "imobiliaria.db");
const caminhoMigracao = join(raizProjeto, "database", "migration.sql");

let instancia: DatabaseSync | undefined;

export function getConnection(): DatabaseSync {
  if (!instancia) {
    mkdirSync(dirname(caminhoBanco), { recursive: true });
    instancia = new DatabaseSync(caminhoBanco);
    instancia.exec(readFileSync(caminhoMigracao, "utf-8"));
  }
  return instancia;
}

export function closeConnection(): void {
  instancia?.close();
  instancia = undefined;
}
