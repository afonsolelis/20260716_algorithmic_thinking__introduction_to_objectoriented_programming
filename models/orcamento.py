"""Orçamento — composição de Cliente, Imovel e Contrato; orquestra o
cálculo do valor mensal total (RF11) e a exportação em CSV (RF12)."""

from models.cliente import Cliente
from models.contrato import Contrato
from models.imovel import Imovel


class Orcamento:
    def __init__(self, cliente: Cliente, imovel: Imovel, contrato: Contrato):
        pass

    def calcular_orcamento(self) -> float:
        raise NotImplementedError

    def get_valor_mensal(self) -> float:
        raise NotImplementedError

    def exibir_resumo(self) -> str:
        raise NotImplementedError

    def exportar_csv(self, arquivo: str) -> None:
        raise NotImplementedError
