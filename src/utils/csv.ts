/** Geração de linhas CSV com quoting mínimo (RFC 4180), espelhando o módulo `csv` do Python. */
const PREFIXOS_FORMULA = new Set(["=", "+", "-", "@"]);

/** Neutraliza CSV/Formula Injection: campos de texto vindos de input do usuário
 * que comecem com um destes caracteres seriam interpretados como fórmula ao
 * abrir o CSV no Excel/Sheets. */
function escaparCampo(campo: string | number): string {
  let texto = String(campo);
  if (typeof campo === "string" && PREFIXOS_FORMULA.has(texto.charAt(0))) {
    texto = `'${texto}`;
  }
  if (/[",\n\r]/.test(texto)) {
    return `"${texto.replaceAll('"', '""')}"`;
  }
  return texto;
}

export function linhaCsv(campos: Array<string | number>): string {
  return campos.map(escaparCampo).join(",") + "\r\n";
}
