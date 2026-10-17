import test from 'node:test';
import assert from 'node:assert/strict';
import { getApiBaseUrl, setApiBaseUrl, resolveApiUrl } from '../src/utils/api.js';

test('API Base URL Configuration and Resolution', async (t) => {
  await t.test('1. resolveApiUrl handles relative paths without base URL', () => {
    // When no base is configured or in test environment default
    const originalEnv = process.env.VITE_API_BASE_URL;
    try {
      delete process.env.VITE_API_BASE_URL;
      delete process.env.VITE_API_URL;
      
      const resolved = resolveApiUrl('/api/health');
      assert.equal(resolved, '/api/health');

      const resolvedNoSlash = resolveApiUrl('api/products');
      assert.equal(resolvedNoSlash, '/api/products');
    } finally {
      if (originalEnv) process.env.VITE_API_BASE_URL = originalEnv;
    }
  });

  await t.test('2. resolveApiUrl preserves absolute HTTP/HTTPS URLs', () => {
    assert.equal(resolveApiUrl('https://example.com/api/test'), 'https://example.com/api/test');
    assert.equal(resolveApiUrl('http://localhost:3000/api/health'), 'http://localhost:3000/api/health');
  });

  await t.test('3. resolveApiUrl prepends base URL cleanly', () => {
    const originalEnv = process.env.VITE_API_BASE_URL;
    try {
      process.env.VITE_API_BASE_URL = 'https://tech.vartualtutor.com';
      assert.equal(resolveApiUrl('/api/admin/login'), 'https://tech.vartualtutor.com/api/admin/login');
      assert.equal(resolveApiUrl('api/admin/login'), 'https://tech.vartualtutor.com/api/admin/login');

      // Trailing slash on base URL should be stripped cleanly
      process.env.VITE_API_BASE_URL = 'https://tech.vartualtutor.com/';
      assert.equal(resolveApiUrl('/api/admin/login'), 'https://tech.vartualtutor.com/api/admin/login');

      // Base URL ending with /api should not duplicate /api/api
      process.env.VITE_API_BASE_URL = 'https://tech.vartualtutor.com/api';
      assert.equal(resolveApiUrl('/api/admin/login'), 'https://tech.vartualtutor.com/api/admin/login');
    } finally {
      if (originalEnv !== undefined) {
        process.env.VITE_API_BASE_URL = originalEnv;
      } else {
        delete process.env.VITE_API_BASE_URL;
      }
    }
  });

  await t.test('4. resolveApiUrl returns empty string for falsy/invalid inputs', () => {
    assert.equal(resolveApiUrl(''), '');
    assert.equal(resolveApiUrl(null), '');
    assert.equal(resolveApiUrl(undefined), '');
    assert.equal(resolveApiUrl(123), '');
  });
});
