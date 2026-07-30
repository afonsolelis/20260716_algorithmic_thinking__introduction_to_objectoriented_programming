interface RespostaOrcamento {
  id: number;
  cliente: string;
  aluguel: number;
  parcela: number;
  valorMensal: number;
  resumo: string;
}

interface RespostaErro {
  erro: string;
}

const form = document.querySelector<HTMLFormElement>("#form-orcamento")!;
const tipoImovelSelect = document.querySelector<HTMLSelectElement>("#tipoImovel")!;
const camposQuartos = document.querySelector<HTMLDivElement>("#campos-quartos")!;
const camposVagas = document.querySelector<HTMLDivElement>("#campos-vagas")!;
const mensagemErro = document.querySelector<HTMLParagraphElement>("#mensagem-erro")!;

const painelResultado = document.querySelector<HTMLElement>("#painel-resultado")!;
const painelVazio = document.querySelector<HTMLElement>("#painel-vazio")!;
const resultadoTitulo = document.querySelector<HTMLHeadingElement>("#resultado-titulo")!;
const metricaAluguel = document.querySelector<HTMLSpanElement>("#metrica-aluguel")!;
const metricaContratoRotulo = document.querySelector<HTMLSpanElement>("#metrica-contrato-rotulo")!;
const metricaContrato = document.querySelector<HTMLSpanElement>("#metrica-contrato")!;
const metricaTotal = document.querySelector<HTMLSpanElement>("#metrica-total")!;
const resumoCompleto = document.querySelector<HTMLPreElement>("#resumo-completo")!;
const btnDownload = document.querySelector<HTMLAnchorElement>("#btn-download")!;

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function atualizarCamposPorTipo(): void {
  const ehEstudio = tipoImovelSelect.value === "estudio";
  camposQuartos.hidden = ehEstudio;
  camposVagas.hidden = !ehEstudio;
}

tipoImovelSelect.addEventListener("change", atualizarCamposPorTipo);
atualizarCamposPorTipo();

function mostrarErro(mensagem: string): void {
  mensagemErro.textContent = mensagem;
  mensagemErro.hidden = false;
}

function limparErro(): void {
  mensagemErro.hidden = true;
  mensagemErro.textContent = "";
}

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  limparErro();

  const dados = new FormData(form);
  const tipoImovel = String(dados.get("tipoImovel"));

  const corpo = {
    nome: String(dados.get("nome") ?? "").trim(),
    possuiCriancas: dados.get("possuiCriancas") === "on",
    tipoImovel,
    qtdQuartos: Number(dados.get("qtdQuartos") ?? 1),
    temGaragem: dados.get("temGaragem") === "on",
    qtdVagas: Number(dados.get("qtdVagas") ?? 0),
    qtdParcelas: Number(dados.get("qtdParcelas") ?? 1),
  };

  if (!corpo.nome) {
    mostrarErro("Informe o nome do cliente para gerar o orçamento.");
    return;
  }

  const resposta = await fetch("/api/orcamentos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  });

  if (!resposta.ok) {
    const erro = (await resposta.json()) as RespostaErro;
    mostrarErro(erro.erro);
    return;
  }

  const resultado = (await resposta.json()) as RespostaOrcamento;
  exibirResultado(resultado, tipoImovel, corpo.qtdParcelas);
});

function exibirResultado(
  resultado: RespostaOrcamento,
  tipoImovel: string,
  qtdParcelas: number,
): void {
  const rotuloTipo =
    tipoImovel === "apartamento" ? "Apartamento" : tipoImovel === "casa" ? "Casa" : "Estúdio";

  resultadoTitulo.textContent = `Orçamento — ${resultado.cliente} (${rotuloTipo})`;
  metricaAluguel.textContent = formatarMoeda(resultado.aluguel);
  metricaContratoRotulo.textContent = `Contrato (${qtdParcelas}x)`;
  metricaContrato.textContent = formatarMoeda(resultado.parcela);
  metricaTotal.textContent = formatarMoeda(resultado.valorMensal);
  resumoCompleto.textContent = resultado.resumo;
  btnDownload.href = `/api/orcamentos/${resultado.id}/csv`;

  painelVazio.hidden = true;
  painelResultado.hidden = false;
}
