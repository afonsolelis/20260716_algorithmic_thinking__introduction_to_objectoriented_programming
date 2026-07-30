# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Educational OOP project (in Portuguese): a rental budget system for "Imobiliária R.M" that calculates monthly rent for houses, apartments, and studios, manages contracts, and exports annual budgets to CSV.

**Current state:** fully implemented in TypeScript/Node — business rules and the 54-test suite (Vitest) are GREEN. The specification lives in the documents (see below) and the SQLite schema in `database/migration.sql` is applied by `src/database/connection.ts`. When changing anything, follow the existing layered architecture rather than inventing a new one.

## Commands

```bash
npm install                # install dependencies
npm run dev                 # server (tsx watch, :3000) + client (Vite, :5173) concurrently
npm run build                # build the client to dist/client
npm start                    # run the server alone (tsx), serving dist/client if built
npm test                     # run the Vitest suite (54 tests)
npm run typecheck            # tsc --noEmit
```

The API listens on `:3000` (`PORT` env var overrides it); the Vite dev server on `:5173` proxies `/api` to it.

## Source of Truth Documents

- `documents/modelagem_problema.md` — business rules, functional requirements (RF01–RF12), and expected test scenarios with exact values. **All pricing logic must match this file.**
- `documents/arquitetura/arquitetura_software.md` — layered architecture, folder structure, component responsibilities (written for the original Python plan; the layer names/responsibilities still apply, ported to TS).
- `documents/mod_estatic/`, `documents/mod-dinamic/`, `documents/mod_dados/` — UML class diagram, sequence diagrams, and ERD (PlantUML/DBML sources + rendered images).

## Architecture

Node/TypeScript app with strict layering; calls flow one way, top to bottom:

1. **`src/client/`** (Vite + TS, vanilla DOM) — form, metrics display, CSV download. No business logic here; talks to the API via `fetch`.
2. **`src/server/`** — `server.ts` (Express bootstrap, serves `dist/client` + mounts the API) and `api.ts` (routes: `POST /api/orcamentos`, `GET /api/orcamentos`, `GET /api/orcamentos/:id/csv`).
3. **`src/services/`** — `CalculoService` (rent calculation, discounts, contract installments) and `ExportService` (CSV generation). Business logic belongs here.
4. **`src/models/`** — `Imovel` is the abstract base (runtime-guarded via `new.target`, mirroring Python's ABC); `Apartamento`, `Casa`, `Estudio` subclass it. `Cliente`, `Contrato`, `Orcamento` are standalone.
5. **`src/database/`** — `connection.ts` (`node:sqlite` connection to `data/imobiliaria.db`, applies `database/migration.sql` on first use) and `queries.ts` (SQL). Tables: `clientes`, `imoveis`, `contratos`, `orcamentos`.
6. **`src/utils/constants.ts`** — base prices and business-rule constants (keep magic numbers out of services). `src/utils/arredondamento.ts` and `src/utils/csv.ts` hold the money-rounding and CSV-quoting helpers.

Tests live in `tests/*.test.ts` (Vitest), one file per Python test module they replaced — mirror any new business rule there before implementing it (RED → GREEN), per `documents/modelagem_problema.md`.

## Business Rules (summary — full detail in modelagem_problema.md)

- Base rent: apartamento R$700 (1 quarto), casa R$900 (1 quarto), estúdio R$1.200 (fixed).
- Surcharges: 2nd bedroom +R$200 (apto) / +R$250 (casa); garage +R$300 (casa/apto); estúdio 2 vagas +R$250, each extra vaga +R$60.
- Discount: 5% on rent for apartamento when the client has no children.
- Contract: fixed R$2.000, split into 1–5 installments (enforced by a DB CHECK constraint and by `Contrato`'s constructor).
- Final monthly value = rent (after surcharges/discount) + contract installment; CSV export lists 12 monthly installments.

Section 6 of `modelagem_problema.md` has five worked test scenarios with expected values — use them to verify calculation code.
