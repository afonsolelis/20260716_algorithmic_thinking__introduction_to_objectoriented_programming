/** Classe abstrata Imovel — estrutura base para todos os tipos de imóveis. */
export abstract class Imovel {
  protected qtdQuartos: number;
  protected temGaragem: boolean;
  protected valorBase = 0.0;

  constructor(qtdQuartos: number, temGaragem: boolean) {
    if (new.target === Imovel) {
      throw new TypeError(
        "Imovel é uma classe abstrata e não pode ser instanciada diretamente.",
      );
    }
    this.qtdQuartos = qtdQuartos;
    this.temGaragem = temGaragem;
  }

  /** Calcula o valor mensal do aluguel conforme as regras do tipo. */
  abstract calcularAluguel(): number;

  getValorBase(): number {
    return this.valorBase;
  }
}
