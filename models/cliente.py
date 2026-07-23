"""Cliente — nome e indicação de crianças (RF05)."""


class Cliente:
    def __init__(self, nome: str, possui_criancas: bool):
        pass

    def get_nome(self) -> str:
        raise NotImplementedError

    def get_possui_criancas(self) -> bool:
        raise NotImplementedError
