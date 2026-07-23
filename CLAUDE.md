# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Educational OOP project (in Portuguese): a rental budget system for "Imobiliária R.M" that calculates monthly rent for houses, apartments, and studios, manages contracts, and exports annual budgets to CSV.

**Current state:** the repository is scaffolded but not yet implemented — `app.py`, `requirements.txt`, and every `.py` file under `models/`, `services/`, `database/`, and `utils/` are empty. The specification lives in the documents (see below) and the SQLite schema in `database/migration.sql` is complete. When implementing, follow the planned architecture rather than inventing a new one.

## Commands

```bash
pip install -r requirements.txt          # planned deps: streamlit>=1.28.0, pandas>=2.0.0
streamlit run app.py                     # run the app (Streamlit UI)
sqlite3 data/imobiliaria.db < database/migration.sql   # apply schema
```

There is no test runner or linter configured yet.

## Source of Truth Documents

- `documents/modelagem_problema.md` — business rules, functional requirements (RF01–RF12), and expected test scenarios with exact values. **All pricing logic must match this file.**
- `documents/arquitetura/arquitetura_software.md` — layered architecture, folder structure, component responsibilities.
- `documents/mod_estatic/`, `documents/mod-dinamic/`, `documents/mod_dados/` — UML class diagram, sequence diagrams, and ERD (PlantUML/DBML sources + rendered images).

## Architecture

Monolithic Streamlit app with strict layering; calls flow one way, top to bottom:

1. **`app.py`** (Streamlit UI) — forms, metrics display, CSV download. No business logic here.
2. **`services/`** — `calculo_service.py` (rent calculation, discounts, contract installments) and `export_service.py` (CSV generation via pandas). Business logic belongs here.
3. **`models/`** — `Imovel` is the abstract base; `Apartamento`, `Casa`, `Estudio` subclass it. `Cliente`, `Contrato`, `Orcamento` are standalone.
4. **`database/`** — `connection.py` (SQLite connection to `data/imobiliaria.db`) and `queries.py` (SQL). Tables: `clientes`, `imoveis`, `contratos`, `orcamentos`.
5. **`utils/constants.py`** — base prices and business-rule constants (keep magic numbers out of services).

## Business Rules (summary — full detail in modelagem_problema.md)

- Base rent: apartamento R$700 (1 quarto), casa R$900 (1 quarto), estúdio R$1.200 (fixed).
- Surcharges: 2nd bedroom +R$200 (apto) / +R$250 (casa); garage +R$300 (casa/apto); estúdio 2 vagas +R$250, each extra vaga +R$60.
- Discount: 5% on rent for apartamento when the client has no children.
- Contract: fixed R$2.000, split into 1–5 installments (enforced by a DB CHECK constraint).
- Final monthly value = rent (after surcharges/discount) + contract installment; CSV export lists 12 monthly installments.

Section 6 of `modelagem_problema.md` has five worked test scenarios with expected values — use them to verify calculation code.
