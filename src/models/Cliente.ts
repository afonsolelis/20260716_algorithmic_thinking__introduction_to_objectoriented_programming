/** Cliente — nome e indicação de crianças (RF05). */
export class Cliente {
  private nome: string;
  private possuiCriancas: boolean;

  constructor(params: { nome: string; possuiCriancas: boolean }) {
    this.nome = params.nome;
    this.possuiCriancas = params.possuiCriancas;
  }

  getNome(): string {
    return this.nome;
  }

  getPossuiCriancas(): boolean {
    return this.possuiCriancas;
  }
}
