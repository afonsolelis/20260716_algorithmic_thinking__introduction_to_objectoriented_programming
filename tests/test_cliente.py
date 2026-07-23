"""RF05 — Cadastro de dados do cliente."""

from models import Cliente


class TestCliente:
    def test_get_nome(self):
        cliente = Cliente(nome="Maria Silva", possui_criancas=True)
        assert cliente.get_nome() == "Maria Silva"

    def test_get_possui_criancas_verdadeiro(self):
        cliente = Cliente(nome="Maria Silva", possui_criancas=True)
        assert cliente.get_possui_criancas() is True

    def test_get_possui_criancas_falso(self):
        cliente = Cliente(nome="João Souza", possui_criancas=False)
        assert cliente.get_possui_criancas() is False
