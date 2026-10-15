/**
 * Code 128 Barcode Generator (Code Set B)
 * Standard linear barcode generator producing crisp scalable SVG.
 * Supports alphanumeric ASCII characters (32 - 126).
 */

const CODE128_PATTERNS = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213", // 0-9
  "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132", // 10-19
  "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211", // 20-29
  "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313", // 30-39
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331", // 40-49
  "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111", // 50-59
  "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214", // 60-69
  "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111", // 70-79
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141", // 80-89
  "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141", // 90-99
  "114131", "311141", "411131", "211412", "211214", "211232", "2331112" // 100-106 (106 is STOP)
];

const START_CODE_B = 104;
const STOP_CODE = 106;

export function generateCode128Svg(text, options = {}) {
  const { 
    height = 42, 
    barWidth = 1.6, 
    quietZone = 16, 
    showText = true, 
    color = '#10263D', 
    bgColor = '#FFFFFF' 
  } = options;

  const cleanText = String(text).trim();
  const codes = [START_CODE_B];
  let checksum = START_CODE_B;

  for (let i = 0; i < cleanText.length; i++) {
    const charCode = cleanText.charCodeAt(i);
    if (charCode < 32 || charCode > 126) {
      throw new Error(`Unsupported character in Code 128: ${cleanText[i]}`);
    }
    const val = charCode - 32;
    codes.push(val);
    checksum += val * (i + 1);
  }

  const checkDigit = checksum % 103;
  codes.push(checkDigit);
  codes.push(STOP_CODE);

  let barsHtml = '';
  let x = quietZone;

  for (let c = 0; c < codes.length; c++) {
    const pattern = CODE128_PATTERNS[codes[c]];
    let isBar = true;
    for (let p = 0; p < pattern.length; p++) {
      const w = parseInt(pattern[p], 10) * barWidth;
      if (isBar) {
        barsHtml += `<rect x="${x.toFixed(1)}" y="0" width="${w.toFixed(1)}" height="${height}" fill="${color}" />`;
      }
      x += w;
      isBar = !isBar;
    }
  }

  const totalWidth = Math.ceil(x + quietZone);
  const totalHeight = showText ? height + 16 : height;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" width="${totalWidth}" height="${totalHeight}">
  <rect width="${totalWidth}" height="${totalHeight}" fill="${bgColor}" />
  ${barsHtml}
  ${showText ? `<text x="${(totalWidth / 2).toFixed(1)}" y="${height + 13}" font-family="ui-monospace, SFMono-Regular, monospace" font-size="11" font-weight="700" fill="${color}" text-anchor="middle" letter-spacing="2">${cleanText}</text>` : ''}
</svg>`;
}
