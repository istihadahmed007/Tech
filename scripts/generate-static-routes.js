import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_PRODUCTS } from '../src/data/catalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '..', 'dist');

export function generateStaticRoutes() {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.warn('[static-routes] dist/index.html does not exist. Skipping route generation.');
    return;
  }

  const baseHtml = fs.readFileSync(indexPath, 'utf-8');
  const productDir = path.join(DIST_DIR, 'product');
  if (!fs.existsSync(productDir)) {
    fs.mkdirSync(productDir, { recursive: true });
  }

  // Generate /product/index.html redirect fallback
  const productFallbackHtml = baseHtml.replace(
    /<title>.*?<\/title>/i,
    '<title>Products — Tech Nest</title>'
  );
  fs.writeFileSync(path.join(productDir, 'index.html'), productFallbackHtml, 'utf-8');

  // Generate /cart/index.html (Shopping Cart)
  const cartDir = path.join(DIST_DIR, 'cart');
  if (!fs.existsSync(cartDir)) {
    fs.mkdirSync(cartDir, { recursive: true });
  }
  const cartHtml = baseHtml.replace(
    /<title>.*?<\/title>/i,
    '<title>Shopping Cart — Tech Nest</title>'
  );
  fs.writeFileSync(path.join(cartDir, 'index.html'), cartHtml, 'utf-8');

  // Generate /checkout/index.html
  const checkoutDir = path.join(DIST_DIR, 'checkout');
  if (!fs.existsSync(checkoutDir)) {
    fs.mkdirSync(checkoutDir, { recursive: true });
  }
  const checkoutHtml = baseHtml.replace(
    /<title>.*?<\/title>/i,
    '<title>Secure Checkout — Tech Nest</title>'
  );
  fs.writeFileSync(path.join(checkoutDir, 'index.html'), checkoutHtml, 'utf-8');

  // Generate /admin/index.html (Private Staff Dashboard SPA Fallback)
  const adminDir = path.join(DIST_DIR, 'admin');
  if (!fs.existsSync(adminDir)) {
    fs.mkdirSync(adminDir, { recursive: true });
  }
  const adminHtml = baseHtml.replace(
    /<title>.*?<\/title>/i,
    '<title>Staff Console — Tech Nest</title>'
  );
  fs.writeFileSync(path.join(adminDir, 'index.html'), adminHtml, 'utf-8');

  // Generate /product/:id/index.html for every authentic product in catalog
  let count = 0;
  for (const prod of INITIAL_PRODUCTS) {
    if (!prod.id) continue;
    const destDir = path.join(productDir, prod.id);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const title = `${prod.title} — Tech Nest`;
    const desc = (prod.description || 'Premium accessories engineered for peak performance in Bangladesh.')
      .replace(/"/g, '&quot;')
      .slice(0, 160);
    const image = prod.image
      ? (prod.image.startsWith('http') ? prod.image : `https://tech.vartualtutor.com${prod.image}`)
      : 'https://tech.vartualtutor.com/assets/products/h2-anc-pro-tws.jpg';
    const canonical = `https://tech.vartualtutor.com/product/${prod.id}`;

    let customizedHtml = baseHtml
      .replace(/<title>.*?<\/title>/i, `<title>${title}</title>`)
      .replace(
        /<meta name="description" content=".*?" \/>/i,
        `<meta name="description" content="${desc}" />\n    <link rel="canonical" href="${canonical}" />`
      );

    // Inject OpenGraph / Twitter meta tags right after canonical
    const ogTags = `
    <!-- Open Graph / Product SEO -->
    <meta property="og:type" content="product" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${canonical}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />
    <meta name="twitter:image" content="${image}" />`;

    customizedHtml = customizedHtml.replace('</head>', `${ogTags}\n  </head>`);

    fs.writeFileSync(path.join(destDir, 'index.html'), customizedHtml, 'utf-8');
    count++;
  }

  // Ensure .htaccess exists in dist
  const htaccessSrc = path.resolve(__dirname, '..', 'public', '.htaccess');
  const htaccessDest = path.join(DIST_DIR, '.htaccess');
  if (fs.existsSync(htaccessSrc) && !fs.existsSync(htaccessDest)) {
    fs.copyFileSync(htaccessSrc, htaccessDest);
  }

  // Ensure _redirects exists in dist
  const redirectsSrc = path.resolve(__dirname, '..', 'public', '_redirects');
  const redirectsDest = path.join(DIST_DIR, '_redirects');
  if (fs.existsSync(redirectsSrc) && !fs.existsSync(redirectsDest)) {
    fs.copyFileSync(redirectsSrc, redirectsDest);
  }

  // Ensure 404.html exists in dist
  const notFoundSrc = path.resolve(__dirname, '..', 'public', '404.html');
  const notFoundDest = path.join(DIST_DIR, '404.html');
  if (fs.existsSync(notFoundSrc) && !fs.existsSync(notFoundDest)) {
    fs.copyFileSync(notFoundSrc, notFoundDest);
  }

  console.log(`[static-routes] Successfully generated ${count} product route directories in dist/product/!`);
}

// Execute directly if run as a script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateStaticRoutes();
}
