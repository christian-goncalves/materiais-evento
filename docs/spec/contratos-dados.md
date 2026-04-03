# Contratos de Dados

## Endpoints oficiais

- `GET /api/materiais`
- `GET /api/pedidos`
- `PUT /api/pedidos`
- `GET /api/companheiros`
- `POST /api/estoque/transferencia`
- `POST /api/estoque/venda-companheiro`
- `GET /api/estoque/resumo`
- `GET /api/financeiro`
- `PATCH /api/financeiro/:id/repasse`

## Pre-requisitos de execucao dos contratos

Variaveis obrigatorias:
- `GSHEETS_SPREADSHEET_ID`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`

Regras:
- Contratos de API dependem dessas variaveis estarem definidas no `.env.local` (local) ou na Vercel (deploy).
- Quando variavel obrigatoria faltar, API deve retornar erro sanitizado (sem expor segredo).

Abas obrigatorias na planilha:
- `materiais`
- `pedidos`
- `pedido_itens`
- `estoque`
- `companheiros`
- `financeiro`

## Contrato - GET /api/materiais

Resposta:

```json
[
  {
    "id": "camiseta",
    "nome": "Camiseta",
    "emoji": "👕",
    "preco": 50,
    "ativo": true,
    "estoque_minimo": 10
  }
]
```

Mapeamento planilha:
- Aba `materiais`: `id`, `nome`, `emoji`, `preco`, `ativo`, `estoque_minimo`.

## Contrato - GET /api/pedidos

Resposta (mantida compativel com o frontend atual):

```json
{
  "pedidos": [
    {
      "id": 1,
      "nome": "Cliente",
      "data": "03/04/2026",
      "tel": "",
      "itens": {
        "camiseta": 2
      },
      "pago": "Nao",
      "pagData": ""
    }
  ]
}
```

Mapeamento planilha:
- Aba `pedidos`: `id`, `nome`, `telefone`, `status_pagamento`, `created_at`.
- Aba `pedido_itens`: `id`, `pedido_id`, `material_id`, `quantidade`, `preco`.

Regra de projecao:
- `itens` no frontend e reconstruido de `pedido_itens` por `pedido_id`.

## Contrato - PUT /api/pedidos

Entrada:

```json
{
  "pedidos": []
}
```

Saida:

```json
{
  "ok": true,
  "updated_at": "2026-04-03T00:00:00.000Z"
}
```

Validacao minima:
- `pedidos` deve ser array.
- `id` numerico.
- `nome` obrigatorio.
- `itens` objeto com ids validos de material.
- `quantidade` inteira > 0.
- `pago` com valores aceitos (`Sim`/`Nao`).

## Estoque e baixo estoque

Mapeamento planilha:
- Aba `estoque`: `id`, `material_id`, `tipo`, `quantidade`, `origem`, `created_at`, `companheiro_id`, `destino_tipo`.

Regras:
- Entrada de reposicao grava `tipo=entrada`.
- Salvamento de pedidos grava `tipo=saida_pedido` por item.
- Transferencia para companheiro grava `tipo=transferencia_companheiro`.
- Venda por companheiro grava `tipo=venda_companheiro`.
- Saldo por material = soma(entrada) - soma(saida).
- Estoque baixo quando saldo < `estoque_minimo`.

## Fluxo companheiros e financeiro (v1 essencial)

- `GET /api/companheiros`:
  - Garante seed inicial com:
    - `hugo` | Hugo
    - `turco` | Turco
    - `leandro-csa-guarulhos` | Leandro CSA Garulho

- `POST /api/estoque/transferencia`:
  - Entrada: `companheiro_id`, `material_id`, `quantidade`, `origem?`
  - Efeito: cria movimento de estoque sem lancamento financeiro.

- `POST /api/estoque/venda-companheiro`:
  - Entrada: `companheiro_id`, `material_id`, `quantidade`, `valor_unitario?`, `origem?`
  - Efeito: cria movimento de estoque + lancamento em `financeiro` com `status_repasse=pendente`.

- `PATCH /api/financeiro/:id/repasse`:
  - Efeito: atualiza apenas `status_repasse` para `repassado` sem alterar estoque.

Validacoes minimas adicionais:
- `companheiro_id` existente e ativo.
- Bloqueio de venda se saldo do companheiro insuficiente.
- Bloqueio de transferencia/venda se estoque global insuficiente.
