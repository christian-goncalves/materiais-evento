# Aceite, Seguranca e Testes

## Checklist de ambiente local (antes do smoke)

- [ ] `node -v` funcionando.
- [ ] `vercel --version` funcionando.
- [ ] Arquivo `.env.local` presente na raiz.
- [ ] Variaveis obrigatorias definidas:
  - `GSHEETS_SPREADSHEET_ID`
  - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
  - `GOOGLE_PRIVATE_KEY`
- [ ] `vercel dev` ativo em `http://localhost:3000`.

## Smoke tests obrigatorios

### Smoke leitura (sem escrita)

Comando:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-api.ps1 -BaseUrl http://localhost:3000 -SkipWrite
```

### Smoke com escrita

Comando:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-api.ps1 -BaseUrl http://localhost:3000
```

## Cenarios funcionais obrigatorios

1. Carregar materiais na interface.
2. Criar pedido com dois itens.
3. Editar pedido criado.
4. Marcar pedido como pago.
5. Excluir pedido.
6. Ler companheiros por `GET /api/companheiros`.
7. Transferir material para companheiro (`POST /api/estoque/transferencia`).
8. Registrar venda do companheiro (`POST /api/estoque/venda-companheiro`).
9. Marcar repasse (`PATCH /api/financeiro/:id/repasse`).

Criterio:
- Fluxo completo sem quebrar UI nem navegacao.
- Fluxos de companheiro e financeiro com consistencia de saldo.
- Endpoints essenciais retornando 200 ponta a ponta.

## Verificacoes de dados

- `pedidos` com linhas consistentes.
- `pedido_itens` refletindo itens de cada pedido.
- `estoque` registrando `saida_pedido` no salvamento de pedidos.
- `estoque` registrando `transferencia_companheiro` e `venda_companheiro` corretamente.
- `financeiro` com `status_repasse=pendente` na venda e `repassado` apos patch.
- Saldo de estoque global e por companheiro calculavel por agregacao.

## Criterios minimos de seguranca

- Credenciais apenas em variaveis de ambiente.
- Nenhuma credencial no frontend.
- Comunicacao com Google Sheets apenas no servidor (`api/`).
- Validacao minima de entrada antes de gravar.
- Bloqueio de venda acima do saldo do companheiro.
- Erros de API sem exposicao de detalhes sensiveis.

## Checklist objetivo para PR

- [ ] Escopo respeitado (sem overengineering).
- [ ] Mudancas concentradas em pontos de acesso a dados.
- [ ] Contratos de API atendidos.
- [ ] Smoke de leitura executado e registrado.
- [ ] Smoke com escrita executado e registrado.
- [ ] README atualizado no minimo necessario.
- [ ] Sem segredos versionados no repositorio.
