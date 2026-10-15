// scripts/download_web_assets.js
import fs from 'fs';
import path from 'path';

const destDir = path.resolve('public/assets/products');

const downloads = [
  {
    file: 'p05-vdenmenv-dr06-earphones.jpg',
    url: 'https://static-01.daraz.lk/p/295f97163391f0a3d02bb4d178429abe.jpg'
  },
  {
    file: 'p06-samsung-tws.jpg',
    url: 'https://images.samsung.com/is/image/samsung/p6pim/bd/sm-r510nzwaasa/gallery/bd-galaxy-buds2-pro-r510-431229-sm-r510nzwaasa-534127785?$1164_776_PNG$'
  },
  {
    file: 'p06-lenovo-tws.jpg',
    url: 'https://static-01.daraz.com.bd/p/13f4cacbb87f4413ee48f59b0902a723.jpg'
  },
  {
    file: 'p06-realme-tws.jpg',
    url: 'https://static-01.daraz.com.bd/p/06a2466dbf6d6abdce35900bbb317d6f.png'
  },
  {
    file: 'p06-oneplus-tws.jpg',
    url: 'https://img.drz.lazcdn.com/static/bd/p/2353b2ec0e9a9ff1fc6e9fefb71c9576.jpg_720x720q80.jpg'
  },
  {
    file: 'p06-oppo-tws.jpg',
    url: 'https://www.oppo.com/content/dam/oppo/common/mkt/v2-2/enco-buds2-pro-en/listpage/enco-buds2-pro-427_600-white.png'
  },
  {
    file: 'p06-mi-tws.jpg',
    url: 'https://i02.appmifile.com/mi-com-product/fly-birds/redmi-buds-8/m/498b6c8679585102c143a5b5051d3be6.jpg'
  },
  {
    file: 'p07-oppo-style-27w-charger.jpg',
    url: 'https://bd-live-21.slatic.net/kf/S830c442af0264db4b3cd67ea154f659fb.jpg'
  },
  {
    file: 'p08-2in1-otg-adapter.jpg',
    url: 'https://static-01.daraz.com.bd/p/375b017a56204f6d61d99d2bb6430617.jpg'
  },
  {
    file: 'p15-san002-luminous-headphones.jpg',
    url: 'https://static-01.daraz.com.bd/p/6e82b024bd24dcb097d04a5fdaf54b84.jpg'
  },
  {
    file: 'p16-ankeer-nk-ny200-headphones.jpg',
    url: 'https://bd-live-21.slatic.net/kf/Sb691bb73052f4efaa89416fe1d207fdeO.jpg'
  },
  {
    file: 'p17-tucci-q8-usb-headset.jpg',
    url: 'https://static-01.daraz.com.bd/p/bc468961d8d898a3d4580e0c1a7a1411.jpg'
  },
  {
    file: 'p18-t9-luminous-headphones.jpg',
    url: 'https://static-01.daraz.com.bd/p/d4b6075c7a99eb83b50d1cc3462ae594.png'
  },
  {
    file: 'p22-hoco-bt-diamond-700h.jpg',
    url: 'https://static-01.daraz.com.bd/p/3a8e6357985094efd43d727f5719a6f7.png'
  },
  {
    file: 'p23-vdenmenv-d50t-typec.jpg',
    url: 'https://img.drz.lazcdn.com/static/bd/p/d9c9b7f27f23fc0db072cb2ea84b0393.png_720x720q80.jpg'
  },
  {
    file: 'p23-vdenmenv-d50l-lightning.jpg',
    url: 'https://static-01.daraz.com.bd/p/9e78af6ca2450c7ee191d6028d90069f.jpg'
  },
  {
    file: 'p26-don-x20-earphones.jpg',
    url: 'https://bd-live-21.slatic.net/kf/Sb643eb93b06e47ccbb4cd4ff3c2ecae40.jpg'
  },
  {
    file: 'p26-sh777-earphones.jpg',
    url: 'https://static-01.daraz.com.bd/p/673190433111fed69f89579efe023bcd.jpg'
  },
  {
    file: 'p26-kin-earphones.jpg',
    url: 'https://static-01.daraz.com.bd/p/275d89ee4073bb3e5fef9ac84f069fe3.jpg'
  }
];

async function run() {
  console.log('Downloading professional studio web pictures for inventory models...');
  for (const item of downloads) {
    try {
      const res = await fetch(item.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        }
      });
      if (!res.ok) {
        console.error(`FAILED ${item.file}: Status ${res.status}`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      const outPath = path.join(destDir, item.file);
      fs.writeFileSync(outPath, buffer);
      console.log(`SAVED: ${item.file} (${(buffer.length / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.error(`ERROR downloading ${item.file}: ${e.message}`);
    }
  }
  console.log('Download complete!');
}

run();
