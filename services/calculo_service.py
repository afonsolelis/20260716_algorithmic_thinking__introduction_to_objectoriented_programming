"""Serviço de cálculo — delega às entidades do modelo (camada de serviço)."""

from models.cliente import Cliente
from models.contrato import Contrato
from models.imovel import Imovel


class CalculoService:
    @staticmethod
    def calcular_aluguel(imovel: Imovel) -> float:
        raise NotImplementedError

    @staticmethod
    def calcular_parcela(contrato: Contrato) -> float:
        raise NotImplementedError

    @staticmethod
    def aplicar_desconto(valor: float, cliente: Cliente, imovel: Imovel) -> float:
        raise NotImplementedError
