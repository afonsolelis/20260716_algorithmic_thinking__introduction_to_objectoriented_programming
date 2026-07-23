"""Serviço de exportação — gera o CSV com as 12 parcelas anuais (RF12)."""

from models.orcamento import Orcamento


class ExportService:
    @staticmethod
    def gerar_csv(orcamento: Orcamento, arquivo: str) -> None:
        raise NotImplementedError
