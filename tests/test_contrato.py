"""RF10 — Contrato de R$ 2.000,00 parcelado em até 5 vezes."""

import pytest

from models import Contrato


class TestContrato:
    def test_valor_fixo_do_contrato(self):
        assert Contrato.VALOR_CONTRATO == 2000.00

    def test_parcela_unica(self):
        contrato = Contrato(qtd_parcelas=1)
        assert contrato.calcular_valor_parcela() == 2000.00

    def test_5_parcelas(self):
        contrato = Contrato(qtd_parcelas=5)
        assert contrato.calcular_valor_parcela() == 400.00

    def test_4_parcelas(self):
        contrato = Contrato(qtd_parcelas=4)
        assert contrato.calcular_valor_parcela() == 500.00

    def test_get_qtd_parcelas(self):
        contrato = Contrato(qtd_parcelas=3)
        assert contrato.get_qtd_parcelas() == 3

    def test_mais_de_5_parcelas_invalido(self):
        """Parcelamento máximo é 5x: acima disso deve levantar ValueError."""
        with pytest.raises(ValueError):
            Contrato(qtd_parcelas=6)

    def test_zero_parcelas_invalido(self):
        with pytest.raises(ValueError):
            Contrato(qtd_parcelas=0)
