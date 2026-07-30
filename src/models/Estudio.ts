/** Estúdio — valor fixo R$ 1.200; 2 vagas +R$ 250; vaga extra +R$ 60 cada. */
import { Imovel } from "./Imovel.js";
import { arredondar } from "../utils/arredondamento.js";
import {
  ACRESCIMO_ESTUDIO_2_VAGAS,
  ACRESCIMO_ESTUDIO_VAGA_EXTRA,
  VALOR_BASE_ESTUDIO,
} from "../utils/constants.js";

export class Estudio extends Imovel {
  private qtdVagas: number;

  constructor(params: { qtdVagas: number }) {
    super(1, params.qtdVagas > 0);
    this.valorBase = VALOR_BASE_ESTUDIO;
    this.qtdVagas = params.qtdVagas;
  }

  calcularAluguel(): number {
    return arredondar(this.valorBase + this.calcularGaragem());
  }

  private calcularGaragem(): number {
    if (this.qtdVagas < 2) {
      return 0.0;
    }
    const vagasExtras = this.qtdVagas - 2;
    return ACRESCIMO_ESTUDIO_2_VAGAS + vagasExtras * ACRESCIMO_ESTUDIO_VAGA_EXTRA;
  }
}
