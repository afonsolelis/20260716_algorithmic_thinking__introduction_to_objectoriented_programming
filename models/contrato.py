"""Contrato — valor fixo R$ 2.000,00, parcelável em até 5 vezes (RF10)."""


class Contrato:
    VALOR_CONTRATO = None  # deve valer 2000.00 na fase GREEN

    def __init__(self, qtd_parcelas: int):
        pass

    def calcular_valor_parcela(self) -> float:
        raise NotImplementedError

    def get_qtd_parcelas(self) -> int:
        raise NotImplementedError
