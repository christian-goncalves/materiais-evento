Use um padrão simples de “comando + etapa” em texto, por exemplo:

`ETAPA <n>: <ação>`

Sugestão prática para este projeto:

1. `[x] ETAPA 1: revisar docs/spec`
2. `[x] ETAPA 2: implementar API Google Sheets (GET /api/materiais e GET /api/pedidos)`
3. `[x] ETAPA 3: implementar PUT /api/pedidos`
4. `[x] ETAPA 4: adaptar index.html para nova API`
5. `[x] ETAPA 5: executar smoke test (com ressalva de ambiente local para teste HTTP completo)`
6. `[x] ETAPA 6: preparar commit/PR`

Para ações específicas, use:
- `EXECUTAR: <tarefa>`
- `REVISAR: <arquivo ou etapa>`
- `VALIDAR: <critério>`
- `COMMIT: <mensagem>`

Exemplos:
- `EXECUTAR: ETAPA 2`
- `VALIDAR: ETAPA 2 com checklist de aceite`
- `REVISAR: docs/spec/contratos-dados.md`
- `COMMIT: feat(api): adicionar leitura de materiais e pedidos via sheets`
