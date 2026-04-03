Use um padrao simples de "comando + etapa" em texto, por exemplo:

`ETAPA <n>: <acao>`

## Etapas oficiais deste projeto

1. `[x] ETAPA 1: revisar docs/spec`
2. `[x] ETAPA 2: implementar API Google Sheets (GET /api/materiais e GET /api/pedidos)`
3. `[x] ETAPA 3: implementar PUT /api/pedidos`
4. `[x] ETAPA 4: adaptar index.html para nova API`
5. `[x] ETAPA 5: executar smoke test`
6. `[x] ETAPA 6: preparar commit/PR`

## Comandos operacionais locais

- `EXECUTAR: preparar stack local`
- `EXECUTAR: vercel dev`
- `VALIDAR: smoke local leitura`
- `VALIDAR: smoke local escrita`

## Definicao operacional dos comandos locais

### EXECUTAR: preparar stack local

1. Instalar Node LTS.
2. Instalar Vercel CLI: `npm i -g vercel`.
3. Criar `.env.local` com variaveis obrigatorias.
4. Confirmar `node -v` e `vercel --version`.

### EXECUTAR: vercel dev

- Rodar na raiz: `vercel dev`
- URL alvo: `http://localhost:3000`

### VALIDAR: smoke local leitura

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-api.ps1 -BaseUrl http://localhost:3000 -SkipWrite
```

### VALIDAR: smoke local escrita

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-api.ps1 -BaseUrl http://localhost:3000
```

Para acoes especificas, use:
- `EXECUTAR: <tarefa>`
- `REVISAR: <arquivo ou etapa>`
- `VALIDAR: <criterio>`
- `COMMIT: <mensagem>`

Exemplos:
- `EXECUTAR: ETAPA 2`
- `VALIDAR: ETAPA 2 com checklist de aceite`
- `REVISAR: docs/spec/contratos-dados.md`
- `COMMIT: feat(api): adicionar leitura de materiais e pedidos via sheets`
