"""RF04, RF06 — Regras de cálculo do Estúdio."""

from models import Estudio


class TestEstudioCalculo:
    def test_1_vaga_valor_fixo(self):
        """Estúdio com 1 vaga: apenas o valor fixo R$ 1.200,00."""
        estudio = Estudio(qtd_vagas=1)
        assert estudio.calcular_aluguel() == 1200.00

    def test_2_vagas_soma_250(self):
        """2 vagas adicionam R$ 250: 1200 + 250 = 1450."""
        estudio = Estudio(qtd_vagas=2)
        assert estudio.calcular_aluguel() == 1450.00

    def test_cenario_5_3_vagas(self):
        """Cenário 5 — 3 vagas: 1200 + 250 + 60 = R$ 1.510,00."""
        estudio = Estudio(qtd_vagas=3)
        assert estudio.calcular_aluguel() == 1510.00

    def test_4_vagas_duas_extras(self):
        """4 vagas: 1200 + 250 + 60 + 60 = R$ 1.570,00."""
        estudio = Estudio(qtd_vagas=4)
        assert estudio.calcular_aluguel() == 1570.00
