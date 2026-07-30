/** Casa — valor base R$ 900, +R$ 250 (2º quarto), +R$ 300 (garagem). */
import { Imovel } from "./Imovel.js";
import { arredondar } from "../utils/arredondamento.js";
import {
  ACRESCIMO_GARAGEM,
  ACRESCIMO_QUARTO_CASA,
  VALOR_BASE_CASA,
} from "../utils/constants.js";

export class Casa extends Imovel {
  constructor(params: { qtdQuartos: number; temGaragem: boolean }) {
    super(params.qtdQuartos, params.temGaragem);
    this.valorBase = VALOR_BASE_CASA;
  }

  calcularAluguel(): number {
    let valor = this.valorBase;
    valor += (this.qtdQuartos - 1) * ACRESCIMO_QUARTO_CASA;
    if (this.temGaragem) {
      valor += ACRESCIMO_GARAGEM;
    }
    return arredondar(valor);
  }
}
