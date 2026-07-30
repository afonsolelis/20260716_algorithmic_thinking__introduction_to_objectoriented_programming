/** Conexão SQLite — abre data/imobiliaria.db e aplica o schema de database/migration.sql. */
import type { DatabaseSync as DatabaseSyncType } from "node:sqlite";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// process.getBuiltinModule (em vez de `import ... from "node:sqlite"`) contorna um
// bug do vite-node: ele só preserva o prefixo "node:" para "node:test" ao normalizar
// specifiers, e derruba "node:sqlite" para o bare id inválido "sqlite" sob Vitest.
const { DatabaseSync } = process.getBuiltinModule("node:sqlite");

const raizProjeto = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
// DB_PATH permite apontar para ":memory:" nos testes, isolando-os do banco real de desenvolvimento.
const caminhoBanco = process.env.DB_PATH ?? join(raizProjeto, "data", "imobiliaria.db");
const caminhoMigracao = join(raizProjeto, "database", "migration.sql");

let instancia: DatabaseSyncType | undefined;

export function getConnection(): DatabaseSyncType {
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

/** Executa `fn` dentro de uma transação SQLite; reverte tudo se `fn` lançar. */
export function runInTransaction<T>(fn: () => T): T {
  const db = getConnection();
  db.exec("BEGIN");
  try {
    const resultado = fn();
    db.exec("COMMIT");
    return resultado;
  } catch (erro) {
    db.exec("ROLLBACK");
    throw erro;
  }
}
