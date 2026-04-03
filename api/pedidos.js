import {
  clearRanges,
  normalizeDateToBr,
  normalizePago,
  nowIso,
  parseBody,
  readRange,
  sanitizeError,
  toNumber,
  writeRange,
} from './_sheets.js';

function buildPedidosFromSheets(pedidosRows, itensRows) {
  const itemsByPedidoId = new Map();
  for (const row of itensRows) {
    const [, pedidoIdRaw, materialIdRaw, quantidadeRaw] = row;
    const pedidoId = toNumber(pedidoIdRaw, NaN);
    const materialId = materialIdRaw ? String(materialIdRaw).trim() : '';
    const quantidade = toNumber(quantidadeRaw, 0);
    if (!Number.isFinite(pedidoId) || !materialId || quantidade <= 0) continue;
    if (!itemsByPedidoId.has(pedidoId)) itemsByPedidoId.set(pedidoId, {});
    itemsByPedidoId.get(pedidoId)[materialId] = quantidade;
  }

  const pedidos = [];
  for (const row of pedidosRows) {
    const [idRaw, nomeRaw, telefoneRaw, statusPagamentoRaw, createdAtRaw] = row;
    const id = toNumber(idRaw, NaN);
    const nome = nomeRaw ? String(nomeRaw).trim() : '';
    if (!Number.isFinite(id) || !nome) continue;
    pedidos.push({
      id,
      nome,
      data: normalizeDateToBr(createdAtRaw),
      tel: telefoneRaw ? String(telefoneRaw) : '',
      itens: itemsByPedidoId.get(id) || {},
      pago: normalizePago(statusPagamentoRaw) === 'Sim' ? 'Sim' : 'Não',
      pagData: '',
    });
  }

  return { pedidos };
}

async function loadMaterialIds() {
  const rows = await readRange('materiais!A2:A');
  return new Set(
    rows
      .map((r) => (r[0] ? String(r[0]).trim() : ''))
      .filter(Boolean)
  );
}

function validatePedidosPayload(payload, materialIds) {
  if (!payload || !Array.isArray(payload.pedidos)) return 'Campo "pedidos" deve ser array';

  for (const p of payload.pedidos) {
    if (!Number.isFinite(Number(p.id))) return 'Pedido com id invalido';
    if (!p.nome || !String(p.nome).trim()) return 'Pedido com nome obrigatorio';
    if (!p.itens || typeof p.itens !== 'object' || Array.isArray(p.itens)) {
      return 'Pedido com itens invalidos';
    }

    const pago = String(p.pago || '');
    if (!['Sim', 'Não', 'Nao'].includes(pago)) return 'Pedido com status de pagamento invalido';

    for (const [materialId, quantidade] of Object.entries(p.itens)) {
      if (!materialIds.has(materialId)) return `Material invalido: ${materialId}`;
      if (!Number.isInteger(Number(quantidade)) || Number(quantidade) <= 0) {
        return `Quantidade invalida para material: ${materialId}`;
      }
    }
  }

  return null;
}

function mapPedidosRows(pedidos) {
  return pedidos.map((p) => [
    Number(p.id),
    String(p.nome || '').trim(),
    String(p.tel || '').trim(),
    normalizePago(p.pago),
    p.data ? normalizeDateToBr(p.data) : normalizeDateToBr(nowIso()),
  ]);
}

function mapPedidoItensRows(pedidos) {
  const rows = [];
  let itemId = 1;
  for (const p of pedidos) {
    const pedidoId = Number(p.id);
    for (const [materialId, quantidadeRaw] of Object.entries(p.itens || {})) {
      const quantidade = Number(quantidadeRaw);
      if (!Number.isFinite(quantidade) || quantidade <= 0) continue;
      rows.push([itemId++, pedidoId, materialId, quantidade, '']);
    }
  }
  return rows;
}

async function rebuildEstoqueRows(pedidos) {
  const existing = await readRange('estoque!A2:H');
  const kept = existing.filter((row) => {
    const tipo = row[2] ? String(row[2]).trim().toLowerCase() : '';
    return tipo !== 'saida_pedido';
  });

  let nextId = 1;
  for (const row of kept) {
    nextId = Math.max(nextId, toNumber(row[0], 0) + 1);
  }

  const saidas = [];
  const createdAt = nowIso();
  for (const p of pedidos) {
    for (const [materialId, quantidadeRaw] of Object.entries(p.itens || {})) {
      const quantidade = Number(quantidadeRaw);
      if (!Number.isFinite(quantidade) || quantidade <= 0) continue;
      saidas.push([nextId++, materialId, 'saida_pedido', quantidade, `pedido:${p.id}`, createdAt, '', 'pedido']);
    }
  }

  return [...kept, ...saidas];
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [pedidosRows, itensRows] = await Promise.all([
        readRange('pedidos!A2:E'),
        readRange('pedido_itens!A2:E'),
      ]);
      return res.status(200).json(buildPedidosFromSheets(pedidosRows, itensRows));
    } catch (err) {
      return res.status(500).json({ error: sanitizeError(err) });
    }
  }

  if (req.method === 'PUT') {
    try {
      const body = parseBody(req);
      const materialIds = await loadMaterialIds();
      const validationError = validatePedidosPayload(body, materialIds);
      if (validationError) return res.status(400).json({ error: validationError });

      const pedidos = body.pedidos;
      const pedidosRows = mapPedidosRows(pedidos);
      const pedidoItensRows = mapPedidoItensRows(pedidos);
      const estoqueRows = await rebuildEstoqueRows(pedidos);

      await clearRanges(['pedidos!A2:E', 'pedido_itens!A2:E', 'estoque!A2:H']);

      if (pedidosRows.length) await writeRange('pedidos!A2:E', pedidosRows);
      if (pedidoItensRows.length) await writeRange('pedido_itens!A2:E', pedidoItensRows);
      if (estoqueRows.length) await writeRange('estoque!A2:H', estoqueRows);

      return res.status(200).json({ ok: true, updated_at: nowIso() });
    } catch (err) {
      return res.status(500).json({ error: sanitizeError(err) });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
