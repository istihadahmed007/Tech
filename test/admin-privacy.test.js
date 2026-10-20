import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Admin Privacy & Access Controls', async (t) => {
  await t.test('1. Customer Storefront Header never exposes admin link or button', () => {
    const headerCode = fs.readFileSync(path.resolve('src/components/Header.jsx'), 'utf8');
    assert.doesNotMatch(headerCode, /onOpenAdmin/i, 'Header must not receive onOpenAdmin prop');
    assert.doesNotMatch(headerCode, /Store Admin Console/i, 'Header must not render admin button');
    assert.doesNotMatch(headerCode, /স্টোর অ্যাডমিন অপারেশন/i, 'Header mobile drawer must not render admin option');
  });

  await t.test('2. Customer Storefront Footer never exposes admin link or button', () => {
    const footerCode = fs.readFileSync(path.resolve('src/components/Footer.jsx'), 'utf8');
    assert.doesNotMatch(footerCode, /onOpenAdmin/i, 'Footer must not receive onOpenAdmin prop');
    assert.doesNotMatch(footerCode, /Store Admin Portal/i, 'Footer must not have Store Admin Portal link');
  });

  await t.test('3. Dedicated /admin route is handled in App.jsx and isolated from storefront', () => {
    const appCode = fs.readFileSync(path.resolve('src/App.jsx'), 'utf8');
    assert.match(appCode, /pathname === '\/admin'/, 'App.jsx must route /admin to dedicated view');
    assert.match(appCode, /if \(isAdminView\)/, 'App.jsx must render AdminDashboard exclusively without storefront');
    assert.doesNotMatch(appCode, /onOpenAdmin/, 'App.jsx must not pass onOpenAdmin to storefront components');
  });

  await t.test('4. Private Sign-In screen has no public registration or default credentials', () => {
    const adminCode = fs.readFileSync(path.resolve('src/components/AdminDashboard.jsx'), 'utf8');
    assert.match(adminCode, /Admin sign in/, 'Must display Admin sign in');
    assert.match(adminCode, /Staff Username or Email/, 'Must prompt for staff username');
    assert.match(adminCode, /Security Password/, 'Must prompt for security password');
    assert.doesNotMatch(adminCode, /admin123|password123|demo/i, 'Must not suggest default credentials');
    assert.doesNotMatch(adminCode, /Create customer account|Sign up for an account|Register as customer/i, 'Must not offer public registration');
  });

  await t.test('5. Private Overview prioritizes Needs Attention first and separates Paid vs Unpaid COD', () => {
    const adminCode = fs.readFileSync(path.resolve('src/components/AdminDashboard.jsx'), 'utf8');
    assert.match(adminCode, /Needs Attention/, 'Must have prominent Needs Attention section');
    assert.match(adminCode, /Paid Revenue/, 'Must display verified Paid Revenue');
    assert.match(adminCode, /Pending COD/, 'Must display separate Pending Cash on Delivery (COD)');
  });

  await t.test('6. Customer contact details are masked in list preview and revealed only in details', () => {
    const adminCode = fs.readFileSync(path.resolve('src/components/AdminDashboard.jsx'), 'utf8');
    assert.match(adminCode, /slice\(0,\s*3\)\}\*\*\*\*.*slice\(-4\)/, 'List preview must mask phone number');
    assert.match(adminCode, /focusedOrder\.customer\?\.phone/, 'Focused order detail view reveals full phone for courier dispatch');
  });

  await t.test('7. Stock levels are labeled with explicit text as well as color', () => {
    const adminCode = fs.readFileSync(path.resolve('src/components/AdminDashboard.jsx'), 'utf8');
    assert.match(adminCode, /Out of Stock \(0\)/, 'Must have text label for Out of Stock');
    assert.match(adminCode, /Low Stock \(/, 'Must have text label for Low Stock');
    assert.match(adminCode, /In Stock \(/, 'Must have text label for In Stock');
  });

  await t.test('8. Stock adjustment requires quantity, mandatory reason, and confirmation', () => {
    const adminCode = fs.readFileSync(path.resolve('src/components/AdminDashboard.jsx'), 'utf8');
    assert.match(adminCode, /Reason for Adjustment \(Mandatory\)/, 'Reason must be required');
    assert.match(adminCode, /Restock shipment received/, 'Must include standard reason options');
    assert.match(adminCode, /Confirm Stock Adjustment/, 'Must require explicit confirmation before applying');
  });

  await t.test('9. Static route generator generates /admin/index.html SPA fallback', () => {
    const staticRoutesCode = fs.readFileSync(path.resolve('scripts/generate-static-routes.js'), 'utf8');
    assert.match(staticRoutesCode, /const adminDir = path\.join\(DIST_DIR, 'admin'\)/, 'Must generate /admin static route');
    assert.match(staticRoutesCode, /Staff Console — Tech Vartual Tutor/, 'Must set proper staff title in static route');
  });
});
