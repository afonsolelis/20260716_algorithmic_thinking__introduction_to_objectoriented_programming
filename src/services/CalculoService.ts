/** Serviço de cálculo — fachada usada pela interface; delega às entidades. */
import { Apartamento } from "../models/Apartamento.js";
import type { Cliente } from "../models/Cliente.js";
import type { Contrato } from "../models/Contrato.js";
import type { Imovel } from "../models/Imovel.js";
import { arredondar } from "../utils/arredondamento.js";
import { DESCONTO_APARTAMENTO_SEM_CRIANCAS } from "../utils/constants.js";

export class CalculoService {
  static calcularAluguel(imovel: Imovel): number {
    return imovel.calcularAluguel();
  }

  static calcularParcela(contrato: Contrato): number {
    return contrato.calcularValorParcela();
  }

  /** Regra 3.3 — 5% de desconto somente para apartamento quando o cliente não possui crianças. */
  static aplicarDesconto(valor: number, cliente: Cliente, imovel: Imovel): number {
    if (imovel instanceof Apartamento && !cliente.getPossuiCriancas()) {
      return arredondar(valor * (1 - DESCONTO_APARTAMENTO_SEM_CRIANCAS));
    }
    return valor;
  }
}
