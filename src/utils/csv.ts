/** Geração de linhas CSV com quoting mínimo (RFC 4180), espelhando o módulo `csv` do Python. */
function escaparCampo(campo: string | number): string {
  const texto = String(campo);
  if (/[",\n\r]/.test(texto)) {
    return `"${texto.replaceAll('"', '""')}"`;
  }
  return texto;
}

export function linhaCsv(campos: Array<string | number>): string {
  return campos.map(escaparCampo).join(",") + "\r\n";
}
