# Plano de Etapas e Subetapas

## Status geral

- [x] Fase 1 - Base do spec
- [x] Fase 2 - API de leitura
- [x] Fase 3 - API de gravacao
- [x] Fase 4 - Adaptacao do frontend
- [x] Fase 5 - Validacao final e PR (parcial: smoke HTTP completo depende de ambiente com servidor ativo)

## Fase 1 - Base do spec

Subetapas:
1. Consolidar este framework em `docs/spec/`.
2. Alinhar contratos e criterios de aceite.

DoD:
- 5 documentos do spec criados e coerentes entre si.
- Regras de execucao sem decisoes criticas em aberto.

Dependencias:
- Nenhuma.

## Fase 2 - API de leitura

Subetapas:
1. Criar cliente Google Sheets no `api/`.
2. Implementar `GET /api/materiais`.
3. Implementar `GET /api/pedidos`.

DoD:
- Endpoints retornam contrato esperado.
- Erros retornam mensagem sanitizada.

Dependencias:
- Fase 1 concluida.
- Variaveis de ambiente configuradas.

## Fase 3 - API de gravacao

Subetapas:
1. Implementar `PUT /api/pedidos` com validacao minima.
2. Persistir `pedidos` e projetar `pedido_itens`.
3. Gerar movimentacao `saida` em `estoque` por pedido salvo.

DoD:
- Gravacao funcional com validacao de payload.
- Planilhas atualizadas com consistencia minima.

Dependencias:
- Fase 2 concluida.

## Fase 4 - Adaptacao do frontend

Subetapas:
1. Trocar funcoes de leitura/escrita no `index.html`.
2. Remover dependencia do token GitHub no fluxo de dados.
3. Preservar UI e fluxo atuais.

DoD:
- Fluxo de pedidos funcional sem GitHub API.
- Sem alteracao visual fora de escopo.

Dependencias:
- Fase 2 e Fase 3 concluidas.

## Fase 5 - Validacao final e PR

Subetapas:
1. Executar smoke tests.
2. Atualizar README com nova configuracao minima.
3. Preparar PR com diff pequeno e explicavel.

DoD:
- Checklist de aceite completo.
- Seguranca minima aplicada.
- PR pronto para revisao.

Dependencias:
- Fase 4 concluida.
