"""Classe base Imovel — conforme diagrama de classes (mod_estatic).

Fase RED do TDD: apenas o esqueleto. Na fase GREEN esta classe deve
se tornar abstrata (ABC) e impedir instanciação direta.
"""


class Imovel:
    def __init__(self, qtd_quartos: int, tem_garagem: bool):
        pass

    def calcular_aluguel(self) -> float:
        raise NotImplementedError

    def get_valor_base(self) -> float:
        raise NotImplementedError
