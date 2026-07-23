"""RF12 — Exportação do orçamento anual em CSV com 12 parcelas."""

import csv

from models import Apartamento, Cliente, Contrato, Orcamento


def _criar_orcamento():
    cliente = Cliente(nome="Ana", possui_criancas=False)
    imovel = Apartamento(qtd_quartos=1, tem_garagem=False, possui_criancas=False)
    contrato = Contrato(qtd_parcelas=5)
    return Orcamento(cliente, imovel, contrato)


class TestExportacaoCsv:
    def test_exportar_csv_cria_arquivo(self, tmp_path):
        arquivo = tmp_path / "orcamento.csv"
        orcamento = _criar_orcamento()
        orcamento.calcular_orcamento()
        orcamento.exportar_csv(str(arquivo))
        assert arquivo.exists()

    def test_csv_contem_12_parcelas(self, tmp_path):
        """O arquivo deve ter cabeçalho + 12 linhas (uma por mês)."""
        arquivo = tmp_path / "orcamento.csv"
        orcamento = _criar_orcamento()
        orcamento.calcular_orcamento()
        orcamento.exportar_csv(str(arquivo))

        with open(arquivo, newline="", encoding="utf-8") as f:
            linhas = list(csv.reader(f))
        assert len(linhas) == 13  # 1 cabeçalho + 12 parcelas

    def test_csv_parcelas_com_valor_mensal(self, tmp_path):
        """Cada parcela anual traz o valor final mensal (cenário 1: 1065.00)."""
        arquivo = tmp_path / "orcamento.csv"
        orcamento = _criar_orcamento()
        orcamento.calcular_orcamento()
        orcamento.exportar_csv(str(arquivo))

        with open(arquivo, newline="", encoding="utf-8") as f:
            leitor = csv.reader(f)
            next(leitor)  # descarta o cabeçalho
            valores = [float(linha[-1]) for linha in leitor]
        assert valores == [1065.00] * 12
