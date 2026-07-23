"""RF02, RF03, RF06-RF09 — Regras de cálculo do Apartamento."""

from models import Apartamento


class TestApartamentoCalculo:
    def test_1_quarto_com_criancas_sem_garagem(self):
        """Base R$ 700, sem acréscimos e sem desconto (cliente com crianças)."""
        apto = Apartamento(qtd_quartos=1, tem_garagem=False, possui_criancas=True)
        assert apto.calcular_aluguel() == 700.00

    def test_2_quartos_soma_200(self):
        """RF07 — 2º quarto adiciona R$ 200,00: 700 + 200 = 900."""
        apto = Apartamento(qtd_quartos=2, tem_garagem=False, possui_criancas=True)
        assert apto.calcular_aluguel() == 900.00

    def test_garagem_soma_300(self):
        """RF08 — garagem adiciona R$ 300,00: 700 + 300 = 1000."""
        apto = Apartamento(qtd_quartos=1, tem_garagem=True, possui_criancas=True)
        assert apto.calcular_aluguel() == 1000.00

    def test_desconto_5_por_cento_sem_criancas(self):
        """RF09 / Cenário 1 — sem crianças: 700 * 0,95 = R$ 665,00."""
        apto = Apartamento(qtd_quartos=1, tem_garagem=False, possui_criancas=False)
        assert apto.calcular_aluguel() == 665.00

    def test_cenario_2_completo(self):
        """Cenário 2 — 2 quartos, garagem, sem crianças:
        (700 + 200 + 300) * 0,95 = R$ 1.140,00."""
        apto = Apartamento(qtd_quartos=2, tem_garagem=True, possui_criancas=False)
        assert apto.calcular_aluguel() == 1140.00
