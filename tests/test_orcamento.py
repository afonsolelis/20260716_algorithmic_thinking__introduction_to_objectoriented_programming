"""RF11 — Valor final mensal (aluguel + parcela do contrato).

Cobre os 5 cenários de teste da seção 6 de documents/modelagem_problema.md.
"""

from models import Apartamento, Casa, Cliente, Contrato, Estudio, Orcamento


class TestCenariosModelagem:
    def test_cenario_1_apto_1q_sem_garagem_sem_criancas(self):
        """Apto 1q sem garagem, sem crianças, contrato 5x:
        665 + 400 = R$ 1.065,00."""
        cliente = Cliente(nome="Ana", possui_criancas=False)
        imovel = Apartamento(qtd_quartos=1, tem_garagem=False, possui_criancas=False)
        contrato = Contrato(qtd_parcelas=5)
        orcamento = Orcamento(cliente, imovel, contrato)
        assert orcamento.calcular_orcamento() == 1065.00

    def test_cenario_2_apto_2q_garagem_sem_criancas(self):
        """Apto 2q com garagem, sem crianças, contrato 4x:
        1140 + 500 = R$ 1.640,00."""
        cliente = Cliente(nome="Bruno", possui_criancas=False)
        imovel = Apartamento(qtd_quartos=2, tem_garagem=True, possui_criancas=False)
        contrato = Contrato(qtd_parcelas=4)
        orcamento = Orcamento(cliente, imovel, contrato)
        assert orcamento.calcular_orcamento() == 1640.00

    def test_cenario_3_casa_1q_com_garagem(self):
        """Casa 1q com garagem, contrato 2x: 1200 + 1000 = R$ 2.200,00."""
        cliente = Cliente(nome="Carla", possui_criancas=True)
        imovel = Casa(qtd_quartos=1, tem_garagem=True)
        contrato = Contrato(qtd_parcelas=2)
        orcamento = Orcamento(cliente, imovel, contrato)
        assert orcamento.calcular_orcamento() == 2200.00

    def test_cenario_4_casa_2q_sem_garagem(self):
        """Casa 2q sem garagem, contrato 1x: 1150 + 2000 = R$ 3.150,00."""
        cliente = Cliente(nome="Diego", possui_criancas=True)
        imovel = Casa(qtd_quartos=2, tem_garagem=False)
        contrato = Contrato(qtd_parcelas=1)
        orcamento = Orcamento(cliente, imovel, contrato)
        assert orcamento.calcular_orcamento() == 3150.00

    def test_cenario_5_estudio_3_vagas(self):
        """Estúdio 3 vagas, contrato 5x: 1510 + 400 = R$ 1.910,00."""
        cliente = Cliente(nome="Elisa", possui_criancas=False)
        imovel = Estudio(qtd_vagas=3)
        contrato = Contrato(qtd_parcelas=5)
        orcamento = Orcamento(cliente, imovel, contrato)
        assert orcamento.calcular_orcamento() == 1910.00


class TestValorMensalEResumo:
    def _orcamento_padrao(self):
        cliente = Cliente(nome="Ana", possui_criancas=False)
        imovel = Apartamento(qtd_quartos=1, tem_garagem=False, possui_criancas=False)
        contrato = Contrato(qtd_parcelas=5)
        return Orcamento(cliente, imovel, contrato)

    def test_get_valor_mensal_apos_calculo(self):
        """RF11 — get_valor_mensal retorna o valor calculado."""
        orcamento = self._orcamento_padrao()
        orcamento.calcular_orcamento()
        assert orcamento.get_valor_mensal() == 1065.00

    def test_exibir_resumo_contem_valor_final(self):
        """RF11 — o resumo textual apresenta o valor final mensal."""
        orcamento = self._orcamento_padrao()
        orcamento.calcular_orcamento()
        resumo = orcamento.exibir_resumo()
        assert isinstance(resumo, str)
        assert "1065" in resumo.replace(".", "").replace(",", "")
