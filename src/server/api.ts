/**
 * Rotas da API — monta Cliente/Imóvel/Contrato, delega à camada de serviço
 * (RF06-RF11), persiste o orçamento e expõe a exportação CSV (RF12).
 */
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Router, type Request, type Response } from "express";
import { Apartamento } from "../models/Apartamento.js";
import { Casa } from "../models/Casa.js";
import { Cliente } from "../models/Cliente.js";
import { Contrato } from "../models/Contrato.js";
import { Estudio } from "../models/Estudio.js";
import { Imovel } from "../models/Imovel.js";
import { Orcamento } from "../models/Orcamento.js";
import { CalculoService } from "../services/CalculoService.js";
import { ExportService } from "../services/ExportService.js";
import {
  buscarOrcamentoCompleto,
  inserirCliente,
  inserirContrato,
  inserirImovel,
  inserirOrcamento,
  listarOrcamentosResumo,
} from "../database/queries.js";
import { MAX_PARCELAS_CONTRATO } from "../utils/constants.js";

type TipoImovel = "apartamento" | "casa" | "estudio";

interface NovoOrcamentoBody {
  nome: string;
  possuiCriancas: boolean;
  tipoImovel: TipoImovel;
  qtdQuartos?: number;
  temGaragem?: boolean;
  qtdVagas?: number;
  qtdParcelas: number;
}

interface DadosImovel {
  tipoImovel: TipoImovel;
  qtdQuartos: number;
  temGaragem: boolean;
  qtdVagas: number;
  possuiCriancas: boolean;
}

function construirImovel(dados: DadosImovel): Imovel {
  switch (dados.tipoImovel) {
    case "apartamento":
      return new Apartamento({
        qtdQuartos: dados.qtdQuartos,
        temGaragem: dados.temGaragem,
        possuiCriancas: dados.possuiCriancas,
      });
    case "casa":
      return new Casa({ qtdQuartos: dados.qtdQuartos, temGaragem: dados.temGaragem });
    case "estudio":
      return new Estudio({ qtdVagas: dados.qtdVagas });
  }
}

function dadosPersistenciaImovel(dados: DadosImovel, imovel: Imovel) {
  return {
    tipo: dados.tipoImovel,
    quartos: dados.tipoImovel === "estudio" ? 1 : dados.qtdQuartos,
    possuiGaragem: dados.tipoImovel === "estudio" ? dados.qtdVagas > 0 : dados.temGaragem,
    vagas: dados.tipoImovel === "estudio" ? dados.qtdVagas : 0,
    valorBase: imovel.getValorBase(),
  };
}

function reconstruirOrcamento(dados: {
  clienteNome: string;
  clientePossuiCriancas: boolean;
  imovelTipo: TipoImovel;
  imovelQuartos: number;
  imovelPossuiGaragem: boolean;
  imovelVagas: number;
  contratoQtdParcelas: number;
}): Orcamento {
  const cliente = new Cliente({
    nome: dados.clienteNome,
    possuiCriancas: dados.clientePossuiCriancas,
  });
  const imovel = construirImovel({
    tipoImovel: dados.imovelTipo,
    qtdQuartos: dados.imovelQuartos,
    temGaragem: dados.imovelPossuiGaragem,
    qtdVagas: dados.imovelVagas,
    possuiCriancas: dados.clientePossuiCriancas,
  });
  const contrato = new Contrato({ qtdParcelas: dados.contratoQtdParcelas });
  const orcamento = new Orcamento(cliente, imovel, contrato);
  orcamento.calcularOrcamento();
  return orcamento;
}

export const apiRouter = Router();

apiRouter.post("/orcamentos", (req: Request, res: Response) => {
  const body = req.body as Partial<NovoOrcamentoBody>;

  if (!body.nome?.trim()) {
    res.status(400).json({ erro: "Informe o nome do cliente." });
    return;
  }
  if (!body.tipoImovel || !["apartamento", "casa", "estudio"].includes(body.tipoImovel)) {
    res.status(400).json({ erro: "Tipo de imóvel inválido." });
    return;
  }
  if (!body.qtdParcelas || body.qtdParcelas < 1 || body.qtdParcelas > MAX_PARCELAS_CONTRATO) {
    res.status(400).json({ erro: `Quantidade de parcelas deve ser entre 1 e ${MAX_PARCELAS_CONTRATO}.` });
    return;
  }

  try {
    const dadosCompletos = body as NovoOrcamentoBody;
    const dadosImovel: DadosImovel = {
      tipoImovel: dadosCompletos.tipoImovel,
      qtdQuartos: dadosCompletos.qtdQuartos ?? 1,
      temGaragem: Boolean(dadosCompletos.temGaragem),
      qtdVagas: dadosCompletos.qtdVagas ?? 0,
      possuiCriancas: Boolean(dadosCompletos.possuiCriancas),
    };
    const cliente = new Cliente({ nome: dadosCompletos.nome.trim(), possuiCriancas: dadosImovel.possuiCriancas });
    const imovel = construirImovel(dadosImovel);
    const contrato = new Contrato({ qtdParcelas: dadosCompletos.qtdParcelas });
    const orcamento = new Orcamento(cliente, imovel, contrato);
    const valorMensal = orcamento.calcularOrcamento();

    const aluguel = CalculoService.calcularAluguel(imovel);
    const parcela = CalculoService.calcularParcela(contrato);

    const clienteId = inserirCliente(cliente.getNome(), cliente.getPossuiCriancas());
    const imovelId = inserirImovel(dadosPersistenciaImovel(dadosImovel, imovel));
    const contratoId = inserirContrato({
      clienteId,
      qtdParcelas: contrato.getQtdParcelas(),
      valorParcela: parcela,
    });
    const orcamentoId = inserirOrcamento({
      clienteId,
      imovelId,
      contratoId,
      valorAluguelBase: imovel.getValorBase(),
      acrescimos: 0,
      desconto: 0,
      valorAluguelComDesconto: aluguel,
      valorParcelaContrato: parcela,
      valorFinalMensal: valorMensal,
    });

    res.status(201).json({
      id: orcamentoId,
      cliente: cliente.getNome(),
      aluguel,
      parcela,
      valorMensal,
      resumo: orcamento.exibirResumo(),
    });
  } catch (erro) {
    res.status(400).json({ erro: erro instanceof Error ? erro.message : "Erro ao calcular orçamento." });
  }
});

apiRouter.get("/orcamentos", (_req: Request, res: Response) => {
  res.json(listarOrcamentosResumo());
});

apiRouter.get("/orcamentos/:id/csv", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const dados = buscarOrcamentoCompleto(id);
  if (!dados) {
    res.status(404).json({ erro: "Orçamento não encontrado." });
    return;
  }

  const orcamento = reconstruirOrcamento(dados);
  const dir = mkdtempSync(join(tmpdir(), "orcamento-"));
  const arquivo = join(dir, `orcamento-${id}.csv`);
  try {
    ExportService.gerarCsv(orcamento, arquivo);
    res.download(arquivo, `orcamento_${dados.clienteNome.toLowerCase().replaceAll(" ", "_")}.csv`, () => {
      rmSync(dir, { recursive: true, force: true });
    });
  } catch (erro) {
    rmSync(dir, { recursive: true, force: true });
    res.status(500).json({ erro: erro instanceof Error ? erro.message : "Erro ao gerar CSV." });
  }
});
