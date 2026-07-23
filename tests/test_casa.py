"""RF02, RF03, RF06-RF08 — Regras de cálculo da Casa."""

from models import Casa


class TestCasaCalculo:
    def test_1_quarto_sem_garagem(self):
        """Base R$ 900, sem acréscimos."""
        casa = Casa(qtd_quartos=1, tem_garagem=False)
        assert casa.calcular_aluguel() == 900.00

    def test_2_quartos_soma_250(self):
        """RF07 / Cenário 4 — 2º quarto adiciona R$ 250: 900 + 250 = 1150."""
        casa = Casa(qtd_quartos=2, tem_garagem=False)
        assert casa.calcular_aluguel() == 1150.00

    def test_garagem_soma_300(self):
        """RF08 / Cenário 3 — garagem adiciona R$ 300: 900 + 300 = 1200."""
        casa = Casa(qtd_quartos=1, tem_garagem=True)
        assert casa.calcular_aluguel() == 1200.00

    def test_2_quartos_com_garagem(self):
        """900 + 250 + 300 = R$ 1.450,00."""
        casa = Casa(qtd_quartos=2, tem_garagem=True)
        assert casa.calcular_aluguel() == 1450.00
