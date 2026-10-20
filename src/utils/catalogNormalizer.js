/**
 * Authoritative Catalog Normalizer & Deduplication Engine
 * Ensures single source of truth with unique product identities across all storefront views.
 */

export function normalizeCatalog(rawProducts) {
  if (!Array.isArray(rawProducts)) return [];

  const seenIds = new Set();
  const seenSkus = new Set();
  const seenModelKeys = new Set();
  const normalized = [];

  for (const item of rawProducts) {
    if (!item) continue;

    // 1. Primary Check: Product ID
    const rawId = item.id !== undefined && item.id !== null ? String(item.id).trim() : null;
    if (rawId) {
      if (seenIds.has(rawId)) continue;
      seenIds.add(rawId);
    }

    // 2. Secondary Check: SKU
    const rawSku = item.sku ? String(item.sku).trim().toUpperCase() : null;
    if (rawSku) {
      if (seenSkus.has(rawSku)) continue;
      seenSkus.add(rawSku);
    }

    // 3. Fallback normalized check: brand + model + clean name
    const brand = (item.brand || '').trim().toLowerCase();
    const model = (item.model || '').trim().toLowerCase();
    const title = (item.title || item.name || '').trim().toLowerCase().replace(/\s+/g, ' ');

    if (!rawId && brand && (model || title)) {
      const modelKey = `${brand}::${model || title}`;
      if (seenModelKeys.has(modelKey)) continue;
      seenModelKeys.add(modelKey);
    }

    // Preserve original record completely intact
    normalized.push(item);
  }

  return normalized;
}

/**
 * Filter a candidate pool of products so that it excludes products already
 * featured in earlier standalone product displays, without fabricating data.
 */
export function filterDistinctProducts(products = [], excludeIds = [], maxCount = null) {
  if (!Array.isArray(products)) return [];

  const excludeSet = new Set(
    (Array.isArray(excludeIds) ? excludeIds : []).map(id => String(id).trim())
  );

  const seenIds = new Set();
  const distinct = [];

  for (const p of products) {
    if (!p) continue;
    const pId = String(p.id).trim();

    // Exclude if already shown in earlier standalone section
    if (excludeSet.has(pId)) continue;

    // Exclude duplicate IDs within this section
    if (seenIds.has(pId)) continue;
    seenIds.add(pId);

    distinct.push(p);
    if (maxCount && distinct.length >= maxCount) break;
  }

  return distinct;
}
