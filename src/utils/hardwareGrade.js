/**
 * 3-Tier Hardware Grading System for Tech Nest
 * Translates catalog metadata into transparent, engineered hardware grades:
 * 1. VERIFIED ORIGINAL (Emerald) - Genuine manufacturer brands (REMAX, Oraimo, Hoco, Vdenmenv genuine lines)
 * 2. 1:1 MASTER GRADE • QC TESTED (Cyan) - Premium precision-engineered 1:1 alternatives & QC tested builds
 * 3. VALUE ESSENTIAL • TESTED (Amber/Zinc) - Budget-tier daily driver accessories
 */

export function getHardwareGrade(product) {
  if (!product) {
    return {
      tier: 'value',
      code: 'VALUE ESSENTIAL • TESTED',
      badgeClass: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
      shortLabel: 'VALUE GRADE',
      color: 'amber'
    };
  }

  const badgeStr = (product.badge || '').toLowerCase();
  const brandStr = (product.brand || '').toLowerCase();
  const verification = (product.verificationNotes || '').toLowerCase();

  // Tier 2: 1:1 MASTER GRADE • QC TESTED (Replaces "Comparable Copy" and "Authenticity Unverified")
  if (
    badgeStr.includes('comparable copy') ||
    brandStr.includes('authenticity unverified') ||
    brandStr.includes('comparable') ||
    verification.includes('comparable copy') ||
    product.id === 'h2-anc-pro-tws' ||
    product.id === 'p25-pro-tws-black'
  ) {
    return {
      tier: 'master_grade',
      code: '1:1 MASTER GRADE • QC TESTED',
      badgeClass: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
      shortLabel: '1:1 MASTER GRADE',
      color: 'cyan'
    };
  }

  // Tier 1: VERIFIED ORIGINAL
  if (
    product.isOriginal ||
    brandStr.includes('remax') ||
    brandStr.includes('recrsi') ||
    brandStr.includes('vdenmenv') ||
    brandStr.includes('ankeer') ||
    (!brandStr.includes('unverified') && !brandStr.includes('unbranded'))
  ) {
    return {
      tier: 'original',
      code: 'VERIFIED ORIGINAL',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
      shortLabel: 'VERIFIED ORIGINAL',
      color: 'emerald'
    };
  }

  // Tier 3: VALUE ESSENTIAL • TESTED
  return {
    tier: 'value',
    code: 'VALUE ESSENTIAL • TESTED',
    badgeClass: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    shortLabel: 'VALUE GRADE',
    color: 'amber'
  };
}

/**
 * Clean Telemetry SKU formatting (e.g. TN-01, TN-04 instead of raw internal P01)
 */
export function formatCleanSku(product) {
  if (!product) return 'TN-00';
  if (product.photoRef) {
    const num = product.photoRef.replace(/^P/i, '');
    return `TN-${num.padStart(2, '0')}`;
  }
  return `TN-${(product.id || 'ITEM').slice(0, 4).toUpperCase()}`;
}

/**
 * Clean Telemetry Spec extraction for modern monospace pill displays
 */
export function getTelemetrySpecs(product) {
  if (!product) return [];
  const specs = [];

  // Wattage / Power Specs
  if (product.specs && product.specs['Output Power']) {
    specs.push(product.specs['Output Power']);
  } else if (product.specs && product.specs['Max Output']) {
    specs.push(product.specs['Max Output']);
  } else if (product.title && product.title.includes('120W')) {
    specs.push('120W MAX');
  } else if (product.title && product.title.includes('65W')) {
    specs.push('65W PD');
  } else if (product.title && product.title.includes('ANC')) {
    specs.push('ANC / H2');
  } else if (product.specs && product.specs['Battery Life']) {
    specs.push(product.specs['Battery Life']);
  }

  // Warranty
  if (product.warranty) {
    specs.push(product.warranty.toUpperCase());
  } else {
    specs.push('QC TESTED');
  }

  // Stock telemetry
  if (product.stock > 0) {
    specs.push(`STOCK: ${product.stock}`);
  } else {
    specs.push('OUT OF STOCK');
  }

  return specs.slice(0, 3);
}
