/**
 * Pure JavaScript QR Code Model 2 SVG Generator
 * Supports Byte Mode, Error Correction Level M, Versions 1-6.
 * Zero external dependencies. Works in Node.js and browser environments.
 */

// Galois Field GF(256) tables with primitive polynomial 0x11D
const GF256_EXP = new Uint8Array(512);
const GF256_LOG = new Uint8Array(256);
(function initGF() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF256_EXP[i] = x;
    GF256_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11D;
  }
  for (let i = 255; i < 512; i++) {
    GF256_EXP[i] = GF256_EXP[i - 255];
  }
})();

function gfMul(x, y) {
  if (x === 0 || y === 0) return 0;
  return GF256_EXP[GF256_LOG[x] + GF256_LOG[y]];
}

function rsGeneratorPoly(degree) {
  let poly = [1];
  for (let i = 0; i < degree; i++) {
    const next = new Array(poly.length + 1).fill(0);
    const factor = GF256_EXP[i];
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= gfMul(poly[j], factor);
      next[j + 1] ^= poly[j];
    }
    poly = next;
  }
  return poly;
}

function rsComputeRemainder(data, polyDegree) {
  const gen = rsGeneratorPoly(polyDegree);
  const res = new Uint8Array(polyDegree);
  for (const byte of data) {
    const factor = byte ^ res[0];
    for (let j = 0; j < polyDegree - 1; j++) {
      res[j] = res[j + 1] ^ gfMul(gen[j + 1], factor);
    }
    res[polyDegree - 1] = gfMul(gen[polyDegree], factor);
  }
  return res;
}

const VERSION_INFO = {
  1: { totalCodewords: 26, ecCodewords: 10, align: [] },
  2: { totalCodewords: 44, ecCodewords: 16, align: [6, 18] },
  3: { totalCodewords: 70, ecCodewords: 26, align: [6, 22] },
  4: { totalCodewords: 100, ecCodewords: 36, align: [6, 26] },
  5: { totalCodewords: 134, ecCodewords: 48, align: [6, 30] },
  6: { totalCodewords: 172, ecCodewords: 64, align: [6, 34] }
};

const ALIGNMENT_COORDS = {
  2: [6, 18],
  3: [6, 22],
  4: [6, 26],
  5: [6, 30],
  6: [6, 34]
};

function getUtf8Bytes(str) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'utf-8');
  }
  return new TextEncoder().encode(str);
}

export function selectVersion(dataLength) {
  for (let v = 1; v <= 6; v++) {
    const info = VERSION_INFO[v];
    const dataCap = info.totalCodewords - info.ecCodewords;
    if (dataLength <= dataCap - 2) {
      return v;
    }
  }
  return 6;
}

export function encodeQRData(text, version) {
  const info = VERSION_INFO[version];
  const maxDataCodewords = info.totalCodewords - info.ecCodewords;
  const utf8 = getUtf8Bytes(text);

  const bits = [];
  function pushBits(val, len) {
    for (let i = len - 1; i >= 0; i--) {
      bits.push((val >> i) & 1);
    }
  }

  // 1. Mode indicator: Byte mode (0100)
  pushBits(0b0100, 4);

  // 2. Character count indicator (8 bits for V1-9)
  pushBits(utf8.length, 8);

  // 3. Data bytes
  for (let i = 0; i < utf8.length; i++) {
    pushBits(utf8[i], 8);
  }

  // 4. Terminator
  const totalBitsNeeded = maxDataCodewords * 8;
  const termLen = Math.min(4, totalBitsNeeded - bits.length);
  pushBits(0, termLen);

  // 5. Pad to byte boundary
  while (bits.length % 8 !== 0) {
    bits.push(0);
  }

  // 6. Codewords & padding bytes
  const bytes = [];
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) {
      b = (b << 1) | bits[i + j];
    }
    bytes.push(b);
  }

  const padBytes = [0xEC, 0x11];
  let padIdx = 0;
  while (bytes.length < maxDataCodewords) {
    bytes.push(padBytes[padIdx % 2]);
    padIdx++;
  }

  // 7. Error correction
  const ec = rsComputeRemainder(bytes, info.ecCodewords);
  return new Uint8Array([...bytes, ...ec]);
}

export function createQRMatrix(text) {
  const utf8 = getUtf8Bytes(text);
  const version = selectVersion(utf8.length);
  const size = version * 4 + 17;
  const matrix = Array.from({ length: size }, () => new Array(size).fill(null));
  const reserved = Array.from({ length: size }, () => new Array(size).fill(false));

  function setFinder(startR, startC) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const row = startR + r;
        const col = startC + c;
        if (row >= 0 && row < size && col >= 0 && col < size) {
          reserved[row][col] = true;
          if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
            if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
              matrix[row][col] = 1;
            } else {
              matrix[row][col] = 0;
            }
          } else {
            matrix[row][col] = 0;
          }
        }
      }
    }
  }

  // Finders
  setFinder(0, 0);
  setFinder(0, size - 7);
  setFinder(size - 7, 0);

  // Alignment pattern
  if (version >= 2) {
    const coords = ALIGNMENT_COORDS[version];
    for (const r of coords) {
      for (const c of coords) {
        if (reserved[r][c]) continue;
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const row = r + dr;
            const col = c + dc;
            reserved[row][col] = true;
            if (Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0)) {
              matrix[row][col] = 1;
            } else {
              matrix[row][col] = 0;
            }
          }
        }
      }
    }
  }

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (!reserved[6][i]) {
      reserved[6][i] = true;
      matrix[6][i] = i % 2 === 0 ? 1 : 0;
    }
    if (!reserved[i][6]) {
      reserved[i][6] = true;
      matrix[i][6] = i % 2 === 0 ? 1 : 0;
    }
  }

  // Dark module
  reserved[4 * version + 9][8] = true;
  matrix[4 * version + 9][8] = 1;

  // Reserve format information areas
  for (let i = 0; i < 9; i++) {
    reserved[8][i] = true;
    reserved[i][8] = true;
  }
  for (let i = 0; i < 8; i++) {
    reserved[8][size - 1 - i] = true;
    reserved[size - 1 - i][8] = true;
  }

  // Data & EC placement
  const allCodewords = encodeQRData(text, version);
  let bitIdx = 0;
  const totalBits = allCodewords.length * 8;

  let row = size - 1;
  let col = size - 1;
  let dir = -1; // up

  while (col > 0) {
    if (col === 6) col--; // Skip vertical timing column

    for (let i = 0; i < size; i++) {
      const currRow = row;
      for (let c = 0; c < 2; c++) {
        const currCol = col - c;
        if (!reserved[currRow][currCol]) {
          let bit = 0;
          if (bitIdx < totalBits) {
            const byte = allCodewords[Math.floor(bitIdx / 8)];
            bit = (byte >> (7 - (bitIdx % 8))) & 1;
            bitIdx++;
          }
          matrix[currRow][currCol] = bit;
        }
      }
      row += dir;
    }
    dir = -dir;
    row += dir;
    col -= 2;
  }

  // Mask 0: (row + col) % 2 === 0
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!reserved[r][c]) {
        if ((r + c) % 2 === 0) {
          matrix[r][c] ^= 1;
        }
      }
    }
  }

  // Format bits: EC Level M (00) + Mask 0 (000)
  // BCH(15, 5) XORed with 0x5412 = [0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0]
  const FORMAT_BITS = [0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0];

  matrix[8][0] = FORMAT_BITS[0];
  matrix[8][1] = FORMAT_BITS[1];
  matrix[8][2] = FORMAT_BITS[2];
  matrix[8][3] = FORMAT_BITS[3];
  matrix[8][4] = FORMAT_BITS[4];
  matrix[8][5] = FORMAT_BITS[5];
  matrix[8][7] = FORMAT_BITS[6];
  matrix[8][8] = FORMAT_BITS[7];
  matrix[7][8] = FORMAT_BITS[8];
  matrix[5][8] = FORMAT_BITS[9];
  matrix[4][8] = FORMAT_BITS[10];
  matrix[3][8] = FORMAT_BITS[11];
  matrix[2][8] = FORMAT_BITS[12];
  matrix[1][8] = FORMAT_BITS[13];
  matrix[0][8] = FORMAT_BITS[14];

  for (let i = 0; i < 7; i++) {
    matrix[size - 1 - i][8] = FORMAT_BITS[i];
  }
  for (let i = 0; i < 8; i++) {
    matrix[8][size - 8 + i] = FORMAT_BITS[7 + i];
  }

  return matrix;
}

export function generateQRCodeSvg(text, options = {}) {
  const { size = 160, margin = 4, darkColor = '#10263D', lightColor = '#FFFFFF' } = options;
  const matrix = createQRMatrix(text);
  const n = matrix.length;
  const total = n + margin * 2;

  let pathD = '';
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (matrix[r][c] === 1) {
        pathD += `M${c + margin},${r + margin}h1v1h-1z `;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${size}" height="${size}" shape-rendering="crispEdges">
  <rect width="${total}" height="${total}" fill="${lightColor}" />
  <path d="${pathD.trim()}" fill="${darkColor}" />
</svg>`;
}
