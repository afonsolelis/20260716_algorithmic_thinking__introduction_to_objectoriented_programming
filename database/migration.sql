-- SQLite migration DDL for Imobiliária R.M
-- Baseado na modelagem de negócio: clientes, imóveis, contratos e orçamentos.

BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    possui_criancas INTEGER NOT NULL DEFAULT 0,
    email TEXT,
    telefone TEXT,
    criado_em TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS imoveis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL CHECK(tipo IN ('apartamento', 'casa', 'estudio')),
    quartos INTEGER NOT NULL DEFAULT 1,
    possui_garagem INTEGER NOT NULL DEFAULT 0,
    vagas INTEGER NOT NULL DEFAULT 0,
    valor_base REAL NOT NULL,
    descricao TEXT,
    criado_em TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS contratos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    valor_total REAL NOT NULL DEFAULT 2000.0,
    qtd_parcelas INTEGER NOT NULL DEFAULT 1 CHECK(qtd_parcelas BETWEEN 1 AND 5),
    valor_parcela REAL NOT NULL,
    criado_em TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    ativo INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (cliente_id) REFERENCES clientes (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orcamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    imovel_id INTEGER NOT NULL,
    contrato_id INTEGER,
    valor_aluguel_base REAL NOT NULL,
    acrescimos REAL NOT NULL DEFAULT 0.0,
    desconto REAL NOT NULL DEFAULT 0.0,
    valor_aluguel_com_desconto REAL NOT NULL,
    valor_parcela_contrato REAL NOT NULL,
    valor_final_mensal REAL NOT NULL,
    criado_em TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    observacoes TEXT,
    FOREIGN KEY (cliente_id) REFERENCES clientes (id) ON DELETE CASCADE,
    FOREIGN KEY (imovel_id) REFERENCES imoveis (id) ON DELETE CASCADE,
    FOREIGN KEY (contrato_id) REFERENCES contratos (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_orcamentos_cliente_id ON orcamentos (cliente_id);
CREATE INDEX IF NOT EXISTS idx_orcamentos_imovel_id ON orcamentos (imovel_id);
CREATE INDEX IF NOT EXISTS idx_contratos_cliente_id ON contratos (cliente_id);

COMMIT;
