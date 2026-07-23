"""Apartamento — valor base R$ 700, +R$ 200 (2º quarto), +R$ 300 (garagem),
desconto de 5% quando o cliente não possui crianças (RF06-RF09)."""

from models.imovel import Imovel


class Apartamento(Imovel):
    def __init__(self, qtd_quartos: int, tem_garagem: bool, possui_criancas: bool):
        pass

    def calcular_aluguel(self) -> float:
        raise NotImplementedError

    def _aplicar_desconto(self) -> float:
        raise NotImplementedError
