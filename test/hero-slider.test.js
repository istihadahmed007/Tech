import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Hero Slider: 5 newly generated slide images exist in public/assets/slider/', () => {
  const expectedFiles = [
    'slide-1-wireless-earbuds.jpg',
    'slide-2-fast-chargers-cables.jpg',
    'slide-3-phone-cases.jpg',
    'slide-4-power-banks.jpg',
    'slide-5-car-phone-holders.jpg'
  ];

  for (const file of expectedFiles) {
    const fullPath = path.resolve('public/assets/slider', file);
    assert.ok(fs.existsSync(fullPath), `Expected slider image file ${file} to exist in public/assets/slider/`);
    const stats = fs.statSync(fullPath);
    assert.ok(stats.size > 20000, `Expected slider image file ${file} to have reasonable size (>20KB)`);
  }
});

test('Hero Slider: Codebase integration and structural integrity', () => {
  const heroCode = fs.readFileSync(path.resolve('src/components/Hero.jsx'), 'utf8');

  // 1. All 5 slides present in exact requested order
  const expectedSlideTitles = [
    'Wireless Earbuds',
    'Fast Chargers and Cables',
    'Phone Cases',
    'Power Banks',
    'Car Phone Holders'
  ];

  const expectedHeadlines = [
    'Sound Beyond Limits',
    'Power Up Your Life',
    'Style Meets Protection',
    'Stay Charged Anywhere',
    'Your Drive. Your Tech.'
  ];

  for (let i = 0; i < expectedSlideTitles.length; i++) {
    const title = expectedSlideTitles[i];
    const headline = expectedHeadlines[i];
    assert.ok(heroCode.includes(title), `Hero.jsx must contain slide title: ${title}`);
    assert.ok(heroCode.includes(headline), `Hero.jsx must contain slide headline: ${headline}`);
  }

  // Verify order
  const idx1 = heroCode.indexOf('Sound Beyond Limits');
  const idx2 = heroCode.indexOf('Power Up Your Life');
  const idx3 = heroCode.indexOf('Style Meets Protection');
  const idx4 = heroCode.indexOf('Stay Charged Anywhere');
  const idx5 = heroCode.indexOf('Your Drive. Your Tech.');

  assert.ok(idx1 < idx2, 'Slide 1 (Earbuds) must precede Slide 2 (Chargers)');
  assert.ok(idx2 < idx3, 'Slide 2 (Chargers) must precede Slide 3 (Cases)');
  assert.ok(idx3 < idx4, 'Slide 3 (Cases) must precede Slide 4 (Power Banks)');
  assert.ok(idx4 < idx5, 'Slide 4 (Power Banks) must precede Slide 5 (Car Holders)');

  // 2. Old obsolete slider contents completely removed
  assert.equal(heroCode.includes('y80-ultra-smartwatch'), false, 'Old product card Y80 must not be in Hero');
  assert.equal(heroCode.includes('p11-y80-ultra-smartwatch.jpg'), false, 'Old image p11 must not be in Hero');
  assert.equal(heroCode.includes('TUCCI A5 Stereo Headset'), false, 'Old product card TUCCI must not be in Hero');
  assert.equal(heroCode.includes('p12-laxasfit-k10-ultra'), false, 'Old product card LAXASFIT must not be in Hero');

  // 3. Carousel functionality
  assert.match(heroCode, /setInterval\(/, 'Hero must have autoplay interval');
  assert.match(heroCode, /5000/, 'Autoplay timer must be 5000ms');
  assert.match(heroCode, /ChevronLeft/, 'Hero must include left navigation arrow');
  assert.match(heroCode, /ChevronRight/, 'Hero must include right navigation arrow');
  assert.match(heroCode, /onTouchStart/, 'Hero must support touch start for mobile swipe');
  assert.match(heroCode, /onTouchEnd/, 'Hero must support touch end for mobile swipe');
  assert.match(heroCode, /prefers-reduced-motion/, 'Hero must respect reduced motion');
  assert.match(heroCode, /IntersectionObserver/, 'Hero must pause autoplay when off-screen');
  assert.match(heroCode, /visibilitychange/, 'Hero must pause autoplay when document is hidden');

  // 4. Real interactive button
  assert.match(heroCode, /hero-slider-shop-btn/, 'Hero must render interactive shop button');
  assert.match(heroCode, /onSelectCategory/, 'Hero button must invoke real category routing');
});
