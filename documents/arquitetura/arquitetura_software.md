# Arquitetura do Software - Sistema de Orçamento Imobiliária R.M

## 1. Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                    APLICAÇÃO MONOLÍTICA                      │
│                      (Streamlit App)                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              INTERFACE (Streamlit)                   │   │
│   │   • Formulários de entrada                          │   │
│   │   • Exibição de resultados                          │   │
│   │   • Botões de ação                                  │   │
│   └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│                           ▼                                 │
│   ┌─────────────────────────────────────────────────────┐   │
│   │           LÓGICA DE NEGÓCIO (Python)                │   │
│   │   • Cálculos de aluguel                             │   │
│   │   • Regras de desconto                              │   │
│   │   • Validações                                      │   │
│   └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│                           ▼                                 │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              ARMAZENAMENTO (SQLite)                 │   │
│   │   • Tabela: clientes                                │   │
│   │   • Tabela: imoveis                                 │   │
│   │   • Tabela: contratos                               │   │
│   │   • Tabela: orcamentos                              │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Stack Tecnológica

| Camada | Tecnologia | Versão | Justificativa |
|--------|------------|--------|---------------|
| **Frontend** | Streamlit | ≥1.28 | Interface interativa, Python puro |
| **Backend** | Python | ≥3.10 | Linguagem do projeto |
| **Banco** | SQLite | 3.x | Zero config, arquivo local |
| **Exportação** | pandas + csv | - | Geração de CSV |

---

## 3. Estrutura de Pastas

```
imobiliaria-rm/
│
├── app.py                    # Arquivo principal (Streamlit)
│
├── models/                   # Camada de modelos
│   ├── __init__.py
│   ├── imovel.py            # Classe Imovel (abstract)
│   ├── apartamento.py       # Classe Apartamento
│   ├── casa.py              # Classe Casa
│   ├── estudio.py           # Classe Estudio
│   ├── cliente.py           # Classe Cliente
│   ├── contrato.py          # Classe Contrato
│   └── orcamento.py         # Classe Orçamento
│
├── services/                 # Camada de serviços
│   ├── __init__.py
│   ├── calculo_service.py   # Lógica de cálculo
│   └── export_service.py    # Exportação CSV
│
├── database/                 # Camada de persistência
│   ├── __init__.py
│   ├── connection.py        # Conexão SQLite
│   └── queries.py           # Consultas SQL
│
├── utils/                    # Utilitários
│   ├── __init__.py
│   └── constants.py         # Constantes (valores base)
│
├── data/                     # Dados do sistema
│   └── imobiliaria.db       # Banco SQLite
│
├── requirements.txt          # Dependências
├── README.md                 # Documentação
└── .gitignore
```

---

## 4. Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                        app.py (Streamlit)                       │
├─────────────────────────────────────────────────────────────────┤
│  • Sidebar: Seleção de operação                                 │
│  • Forms: Coleta de dados                                       │
│  • Metrics: Exibição de valores                                 │
│  • Download: Exportação CSV                                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                                │
├─────────────────────────┬───────────────────────────────────────┤
│   CalculoService        │    ExportService                      │
│   • calcular_aluguel()  │    • gerar_csv()                      │
│   • calcular_parcela()  │    • criar_dataframe()                │
│   • aplicar_desconto()  │    • salvar_arquivo()                 │
└─────────────────────────┴───────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MODEL LAYER                                  │
├─────────────────────────────────────────────────────────────────┤
│  Imovel (abstract)  ←──  Apartamento                           │
│                       ←──  Casa                                 │
│                       ←──  Estudio                              │
│                                                                 │
│  Cliente  │  Contrato  │  Orcamento                            │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│              SQLite (imobiliaria.db)                             │
│  • clientes    • imoveis    • contratos    • orcamentos          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Fluxo de Dados

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│   USUÁRIO│───▶│   VIEW   │───▶│  SERVICE │───▶│ DATABASE │
│ (Browser)│    │(Streamlit)│   │  (Logic) │    │ (SQLite) │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
     │               │               │               │
     │   1. Input    │               │               │
     │──────────────▶│               │               │
     │               │   2. Request  │               │
     │               │──────────────▶│               │
     │               │               │   3. Query    │
     │               │               │──────────────▶│
     │               │               │   4. Result   │
     │               │               │◀──────────────│
     │               │   5. Response │               │
     │               │◀──────────────│               │
     │   6. Output   │               │               │
     │◀──────────────│               │               │
```

---

## 6. Endpoints da Aplicação

| Página | Função | Descrição |
|--------|--------|-----------|
| **🏠 Início** | `home.py` | Dashboard com resumo |
| **📝 Novo Orçamento** | `novo_orcamento.py` | Formulário completo |
| **📋 Orçamentos** | `lista_orcamentos.py` | Lista de orçamentos |
| **📊 Detalhes** | `detalhes.py` | Ver orçamento específico |
| **⬇️ Exportar** | `exportar.py` | Gerar CSV |

---

## 7. Dependências

```txt
# requirements.txt
streamlit>=1.28.0
pandas>=2.0.0
```

---

## 8. Deploy

| Plataforma | Tipo | Custo | Observação |
|------------|------|-------|------------|
| **Streamlit Cloud** | PaaS | Grátis | Recomendado, deploy via GitHub |
| **PythonAnywhere** | PaaS | Grátis/Pago | Opção alternativa |
| **Render** | PaaS | Grátis | Bom para apps pequenos |

### Deploy no Streamlit Cloud:

1. Push para GitHub
2. Acessar https://share.streamlit.io
3. Conectar repositório
4. Selecionar `app.py`
5. Deploy automático

---

## 9. Requisitos Não Funcionais Atendidos

| Requisito | Solução |
|-----------|---------|
| **Manutenibilidade** | Código modularizado por camadas |
| **Confiabilidade** | Testes unitários nos services |
| **Usabilidade** | Interface Streamlit intuitiva |
| **Interoperabilidade** | Exportação CSV |
| **Escalabilidade** | Suficiente para 10 users |
