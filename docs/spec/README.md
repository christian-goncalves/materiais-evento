# Spec-Driven Leve - Fonte de Verdade

Este diretório define a fonte de verdade da refatoração de persistência para Google Sheets.

## Objetivo da contribuição

Substituir a persistência atual em JSON/GitHub por Google Sheets com o mínimo de mudança estrutural, mantendo fluxo e interface do app.

## Regra operacional

A implementação só avança quando o item estiver coberto neste spec.

## Ordem oficial de execução

1. Validar escopo e decisões em `escopo-e-decisoes.md`.
2. Executar fases e subetapas em `plano-etapas.md`.
3. Implementar e validar contratos de dados em `contratos-dados.md`.
4. Validar aceite, segurança e testes em `aceite-seguranca-testes.md`.
5. Abrir PR apenas após checklist completo.

## Critério de pronto por etapa

- Requisito implementado conforme contrato.
- Sem mudança visual fora de escopo.
- Segurança mínima aplicada.
- Teste de fumaça da etapa aprovado.

## Documento de origem

`C:\laragon\www\encompasso\prompt-chatgpt.md` permanece como insumo de origem.
Este diretório é a referência operacional para execução e PR.
