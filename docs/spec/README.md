# Spec-Driven Leve - Fonte de Verdade

Este diretorio define a fonte de verdade da refatoracao de persistencia para Google Sheets.

## Objetivo da contribuicao

Substituir a persistencia atual em JSON/GitHub por Google Sheets com o minimo de mudanca estrutural, mantendo fluxo e interface do app.

## Regra operacional

A implementacao so avanca quando o item estiver coberto neste spec.

## Stack local obrigatoria

- Node.js 20 LTS (ou 18+ compativel)
- npm
- Vercel CLI (execucao local de `index.html` + `api/*`)
- Google Sheets API habilitada no projeto Google Cloud
- Service Account com acesso de editor na planilha

## URL local padrao

- `http://localhost:3000`

## Execucao local passo a passo

1. Instalar Node.js e validar: `node -v` e `npm -v`.
2. Instalar Vercel CLI: `npm i -g vercel`.
3. Validar CLI: `vercel --version`.
4. Configurar Google Cloud + Service Account + chave JSON.
5. Compartilhar a planilha com o email da Service Account (Editor).
6. Criar abas/cabecalhos exigidos pelos contratos.
7. Criar `.env.local` na raiz com:
   - `GSHEETS_SPREADSHEET_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY` (com `\n` escapado)
8. Rodar servidor local: `vercel dev`.
9. Validar endpoints em `http://localhost:3000`.
10. Rodar smoke de leitura:
    - `powershell -ExecutionPolicy Bypass -File .\\scripts\\smoke-api.ps1 -BaseUrl http://localhost:3000 -SkipWrite`
11. Rodar smoke com escrita:
    - `powershell -ExecutionPolicy Bypass -File .\\scripts\\smoke-api.ps1 -BaseUrl http://localhost:3000`

## Ordem oficial de execucao

1. Validar escopo e decisoes em `escopo-e-decisoes.md`.
2. Executar fases e subetapas em `plano-etapas.md`.
3. Implementar e validar contratos de dados em `contratos-dados.md`.
4. Validar aceite, seguranca e testes em `aceite-seguranca-testes.md`.
5. Abrir PR apenas apos checklist completo.

## Criterio de pronto por etapa

- Requisito implementado conforme contrato.
- Sem mudanca visual fora de escopo.
- Seguranca minima aplicada.
- Teste de fumaca da etapa aprovado.

## Documento de origem

`C:\laragon\www\encompasso\prompt-chatgpt.md` permanece como insumo de origem.
Este diretorio e a referencia operacional para execucao e PR.
