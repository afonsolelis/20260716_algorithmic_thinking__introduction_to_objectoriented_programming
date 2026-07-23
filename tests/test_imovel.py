"""RF01 — Tipos de imóvel e contrato da classe abstrata Imovel."""

import pytest

from models import Apartamento, Casa, Estudio, Imovel


class TestImovelAbstrata:
    def test_imovel_nao_pode_ser_instanciado_diretamente(self):
        """Imovel é abstrata: instanciar direto deve levantar TypeError."""
        with pytest.raises(TypeError):
            Imovel(qtd_quartos=1, tem_garagem=False)


class TestValorBase:
    def test_valor_base_apartamento_700(self):
        """RF06 — Apartamento tem valor base R$ 700,00."""
        apto = Apartamento(qtd_quartos=1, tem_garagem=False, possui_criancas=True)
        assert apto.get_valor_base() == 700.00

    def test_valor_base_casa_900(self):
        """RF06 — Casa tem valor base R$ 900,00."""
        casa = Casa(qtd_quartos=1, tem_garagem=False)
        assert casa.get_valor_base() == 900.00

    def test_valor_base_estudio_1200(self):
        """RF06 — Estúdio tem valor base fixo R$ 1.200,00."""
        estudio = Estudio(qtd_vagas=1)
        assert estudio.get_valor_base() == 1200.00


class TestPolimorfismo:
    def test_todos_os_tipos_calculam_aluguel(self):
        """RF01/RF06 — todo Imovel responde a calcular_aluguel() com float > 0."""
        imoveis = [
            Apartamento(qtd_quartos=1, tem_garagem=False, possui_criancas=True),
            Casa(qtd_quartos=1, tem_garagem=False),
            Estudio(qtd_vagas=1),
        ]
        for imovel in imoveis:
            valor = imovel.calcular_aluguel()
            assert isinstance(valor, float)
            assert valor > 0
