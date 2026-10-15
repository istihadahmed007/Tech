// scripts/search_and_fetch_models.js
import fs from 'fs';
import path from 'path';

const queries = [
  { key: 'p07_charger', q: '27w fast charger' },
  { key: 'p08_otg', q: '2 in 1 otg type c micro usb' },
  { key: 'p15_rgb_headphone', q: 'luminous bluetooth headphone RGB' },
  { key: 'p16_ny200_headphone', q: 'wireless bluetooth headphone black' },
  { key: 'p17_tucci_q8', q: 'tucci q8 usb' },
  { key: 'p18_t9_headphone', q: 'wireless headphone gold' },
  { key: 'p22_hoco_neckband', q: 'hoco sports bluetooth neckband' },
  { key: 'p23_denmen_lightning', q: 'vdenmenv lightning cable' },
  { key: 'p23_denmen_typec', q: 'vdenmenv d50t' },
  { key: 'p26_donx20', q: 'in ear wired earphones 3.5mm bass' },
  { key: 'p26_sh777', q: 'stereo wired earphones 3.5mm mic' }
];

async function run() {
  const results = {};
  for (const { key, q } of queries) {
    const url = 'https://www.daraz.com.bd/catalog/?ajax=true&q=' + encodeURIComponent(q);
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json'
        }
      });
      if (res.status === 200) {
        const data = await res.json();
        const items = data.mods?.listItems || [];
        results[key] = items.slice(0, 5).map(it => ({
          name: it.name,
          image: it.image,
          price: it.price
        }));
      }
    } catch (e) {
      console.error(key, e.message);
    }
  }

  console.log(JSON.stringify(results, null, 2));
}

run();
