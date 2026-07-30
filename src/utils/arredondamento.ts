/** Arredondamento monetário (2 casas decimais) — precisão exigida pela RNF03. */
export function arredondar(valor: number): number {
  return Number(valor.toFixed(2));
}
