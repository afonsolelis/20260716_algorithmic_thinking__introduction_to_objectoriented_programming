# Modelagem do Problema - Orçamento de Aluguel Imobiliária R.M

## 1. Descrição do Problema

A Imobiliária R.M precisa de uma aplicação para automatizar a geração de orçamentos de aluguel de imóveis (casas, apartamentos e estúdios) para seus clientes. O sistema deve calcular o valor mensal do aluguel considerando regras de negócio específicas, gerenciar contratos e permitir a exportação dos dados.

---

## 2. Direcionadores de Negócio (Business Drivers)

| Driver | Descrição |
|--------|-----------|
| **Automatização** | Substituir processo manual de cálculo de orçamentos |
| **Precisão** | Garantir exatidão nos cálculos de valores e descontos |
| **Agilidade** | Permitir geração rápida de propostas para clientes |
| **Padronização** | Unificar regras de cálculo para todos os corretores |
| **Exportação** | Gerar relatórios em formato .csv para controle financeiro |

---

## 3. Regras de Negócio

### 3.1 Valores Base por Tipo de Imóvel

| Tipo de Imóvel | Valor Base | Observação |
|----------------|------------|------------|
| Apartamento | R$ 700,00 | Por 1 quarto |
| Casa | R$ 900,00 | Por 1 quarto |
| Estúdio | R$ 1.200,00 | Valor fixo |

### 3.2 Acréscimos

| Regra | Cálculo |
|-------|---------|
| Apartamento 2 quartos | +R$ 200,00 na mensalidade |
| Casa 2 quartos | +R$ 250,00 na mensalidade |
| Garagem (Casa/Apartamento) | +R$ 300,00 fixo |
| Estúdio - 2 vagas | +R$ 250,00 |
| Estúdio - vaga extra | +R$ 60,00 por vaga |

### 3.3 Descontos

| Regra | Desconto |
|-------|----------|
| Apartamento para pessoa sem crianças | 5% sobre o valor do aluguel |

### 3.4 Contrato Imobiliário

| Item | Valor/Regra |
|------|-------------|
| Valor fixo do contrato | R$ 2.000,00 |
| Parcelamento | Até 5 vezes |
| Valor da parcela | R$ 2.000,00 / qtd_parcelas |

### 3.5 Saída Esperada

- Exibir valor final do aluguel mensal (aluguel + parcela do contrato)
- Gerar arquivo .csv com 12 parcelas do orçamento anual

---

## 4. Requisitos Funcionais

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF01 | Cadastrar tipo de imóvel (Apartamento, Casa, Estúdio) | Alta |
| RF02 | Definir quantidade de quartos do imóvel | Alta |
| RF03 | Informar se o imóvel possui garagem | Alta |
| RF04 | Cadastrar quantidade de vagas (para estúdios) | Alta |
| RF05 | Cadastrar dados do cliente (nome, possui crianças) | Alta |
| RF06 | Calcular valor base do aluguel conforme tipo | Alta |
| RF07 | Adicionar acréscimos por quartos extras | Alta |
| RF08 | Adicionar acréscimo por garagem | Alta |
| RF09 | Aplicar desconto de 5% (apartamento sem crianças) | Alta |
| RF10 | Calcular parcela do contrato (até 5x) | Alta |
| RF11 | Exibir valor final mensal | Alta |
| RF12 | Gerar arquivo .csv com 12 parcelas anuais | Média |

---

## 5. Requisitos Não Funcionais

| ID | Requisito | Categoria |
|----|-----------|-----------|
| RNF01 | Utilizar princípios de Programação Orientada a Objetos | Manutenibilidade |
| RNF02 | Código bem estruturado e documentado | Manutenibilidade |
| RNF03 | Cálculos devem ser precisos (exatidão matemática) | Confiabilidade |
| RNF04 | Exportação em formato .csv padronizado | Interoperabilidade |
| RNF05 | Interface intuitiva (se houver) | Usabilidade |

---

## 6. Cenários de Teste

| # | Entrada | Esperado |
|---|---------|----------|
| 1 | Apto 1q, sem garagem, sem crianças | R$ 700 - 5% = R$ 665 + contrato |
| 2 | Apto 2q, com garagem, sem crianças | R$ 700 + 200 + 300 - 5% = R$ 1.140 + contrato |
| 3 | Casa 1q, com garagem | R$ 900 + 300 = R$ 1.200 + contrato |
| 4 | Casa 2q, sem garagem | R$ 900 + 250 = R$ 1.150 + contrato |
| 5 | Estudio, 3 vagas | R$ 1.200 + 250 + 60 = R$ 1.510 + contrato |

---

## 7. Tecnologias Recomendadas

| Camada | Tecnologia |
|--------|------------|
| Linguagem | Python |
| Framework (opcional) | Django |
| Interface (opcional) | HTML/CSS |
| Versionamento | GitHub |
| Exportação | Biblioteca `csv` do Python |
