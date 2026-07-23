"""Estúdio — valor fixo R$ 1.200; 2 vagas +R$ 250; vaga extra +R$ 60 cada."""

from models.imovel import Imovel


class Estudio(Imovel):
    def __init__(self, qtd_vagas: int):
        pass

    def calcular_aluguel(self) -> float:
        raise NotImplementedError

    def _calcular_garagem(self) -> float:
        raise NotImplementedError
