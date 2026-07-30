/** Consultas SQL — persistência de clientes, imóveis, contratos e orçamentos. */
import { getConnection } from "./connection.js";

export function inserirCliente(nome: string, possuiCriancas: boolean): number {
  const db = getConnection();
  const resultado = db
    .prepare("INSERT INTO clientes (nome, possui_criancas) VALUES (?, ?)")
    .run(nome, possuiCriancas ? 1 : 0);
  return Number(resultado.lastInsertRowid);
}

export function inserirImovel(params: {
  tipo: "apartamento" | "casa" | "estudio";
  quartos: number;
  possuiGaragem: boolean;
  vagas: number;
  valorBase: number;
}): number {
  const db = getConnection();
  const resultado = db
    .prepare(
      `INSERT INTO imoveis (tipo, quartos, possui_garagem, vagas, valor_base)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(
      params.tipo,
      params.quartos,
      params.possuiGaragem ? 1 : 0,
      params.vagas,
      params.valorBase,
    );
  return Number(resultado.lastInsertRowid);
}

export function inserirContrato(params: {
  clienteId: number;
  qtdParcelas: number;
  valorParcela: number;
}): number {
  const db = getConnection();
  const resultado = db
    .prepare(
      `INSERT INTO contratos (cliente_id, qtd_parcelas, valor_parcela)
       VALUES (?, ?, ?)`,
    )
    .run(params.clienteId, params.qtdParcelas, params.valorParcela);
  return Number(resultado.lastInsertRowid);
}

export function inserirOrcamento(params: {
  clienteId: number;
  imovelId: number;
  contratoId: number;
  valorAluguelBase: number;
  acrescimos: number;
  desconto: number;
  valorAluguelComDesconto: number;
  valorParcelaContrato: number;
  valorFinalMensal: number;
}): number {
  const db = getConnection();
  const resultado = db
    .prepare(
      `INSERT INTO orcamentos (
         cliente_id, imovel_id, contrato_id, valor_aluguel_base, acrescimos,
         desconto, valor_aluguel_com_desconto, valor_parcela_contrato, valor_final_mensal
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      params.clienteId,
      params.imovelId,
      params.contratoId,
      params.valorAluguelBase,
      params.acrescimos,
      params.desconto,
      params.valorAluguelComDesconto,
      params.valorParcelaContrato,
      params.valorFinalMensal,
    );
  return Number(resultado.lastInsertRowid);
}

export interface OrcamentoCompleto {
  id: number;
  clienteNome: string;
  clientePossuiCriancas: boolean;
  imovelTipo: "apartamento" | "casa" | "estudio";
  imovelQuartos: number;
  imovelPossuiGaragem: boolean;
  imovelVagas: number;
  contratoQtdParcelas: number;
  valorFinalMensal: number;
  criadoEm: string;
}

export function buscarOrcamentoCompleto(id: number): OrcamentoCompleto | undefined {
  const db = getConnection();
  const linha = db
    .prepare(
      `SELECT
         o.id AS id,
         c.nome AS clienteNome,
         c.possui_criancas AS clientePossuiCriancas,
         i.tipo AS imovelTipo,
         i.quartos AS imovelQuartos,
         i.possui_garagem AS imovelPossuiGaragem,
         i.vagas AS imovelVagas,
         ct.qtd_parcelas AS contratoQtdParcelas,
         o.valor_final_mensal AS valorFinalMensal,
         o.criado_em AS criadoEm
       FROM orcamentos o
       JOIN clientes c ON c.id = o.cliente_id
       JOIN imoveis i ON i.id = o.imovel_id
       LEFT JOIN contratos ct ON ct.id = o.contrato_id
       WHERE o.id = ?`,
    )
    .get(id) as
    | (Omit<OrcamentoCompleto, "clientePossuiCriancas" | "imovelPossuiGaragem"> & {
        clientePossuiCriancas: number;
        imovelPossuiGaragem: number;
      })
    | undefined;

  if (!linha) {
    return undefined;
  }
  return {
    ...linha,
    clientePossuiCriancas: linha.clientePossuiCriancas === 1,
    imovelPossuiGaragem: linha.imovelPossuiGaragem === 1,
  };
}

export function listarOrcamentosResumo(): OrcamentoCompleto[] {
  const db = getConnection();
  const linhas = db
    .prepare(
      `SELECT
         o.id AS id,
         c.nome AS clienteNome,
         c.possui_criancas AS clientePossuiCriancas,
         i.tipo AS imovelTipo,
         i.quartos AS imovelQuartos,
         i.possui_garagem AS imovelPossuiGaragem,
         i.vagas AS imovelVagas,
         ct.qtd_parcelas AS contratoQtdParcelas,
         o.valor_final_mensal AS valorFinalMensal,
         o.criado_em AS criadoEm
       FROM orcamentos o
       JOIN clientes c ON c.id = o.cliente_id
       JOIN imoveis i ON i.id = o.imovel_id
       LEFT JOIN contratos ct ON ct.id = o.contrato_id
       ORDER BY o.criado_em DESC`,
    )
    .all() as Array<
    Omit<OrcamentoCompleto, "clientePossuiCriancas" | "imovelPossuiGaragem"> & {
      clientePossuiCriancas: number;
      imovelPossuiGaragem: number;
    }
  >;

  return linhas.map((linha) => ({
    ...linha,
    clientePossuiCriancas: linha.clientePossuiCriancas === 1,
    imovelPossuiGaragem: linha.imovelPossuiGaragem === 1,
  }));
}
