/**
 * Bulletproof API Fetch Utility for Glacial Tech Accessories Storefront
 * 
 * Safely handles JSON parsing, network errors, dynamic base URL configuration,
 * and unexpected HTML responses (e.g. 404/500/SPA fallback <!DOCTYPE html>...) 
 * which would otherwise trigger:
 * "SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON"
 */

export function getApiBaseUrl() {
  // 1. Browser localStorage override (configurable from Admin UI or console)
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = window.localStorage.getItem('tech_api_base_url');
      if (stored && stored.trim()) return stored.trim();
    } catch (e) {}
  }

  // 2. Global window override (e.g. window.__API_BASE_URL__)
  if (typeof window !== 'undefined' && window.__API_BASE_URL__) {
    return String(window.__API_BASE_URL__).trim();
  }

  // 3. Built-in Vite environment variable
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // In local development, if VITE_API_BASE_URL points to remote host,
    // allow local dev server to handle /api unless VITE_FORCE_REMOTE_API is true
    if (import.meta.env.DEV && !import.meta.env.VITE_FORCE_REMOTE_API) {
      const configured = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').trim();
      if (configured.includes('tech.vartualtutor.com')) {
        return '';
      }
    }
    return (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').trim();
  }

  // 4. Node.js environment fallback (for automated tests)
  if (typeof process !== 'undefined' && process.env) {
    return (process.env.VITE_API_BASE_URL || process.env.VITE_API_URL || '').trim();
  }

  return '';
}

export function setApiBaseUrl(url) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      if (!url || !url.trim()) {
        window.localStorage.removeItem('tech_api_base_url');
      } else {
        window.localStorage.setItem('tech_api_base_url', url.trim());
      }
      window.dispatchEvent(new CustomEvent('tech_api_base_url_changed', { detail: { url: (url || '').trim() } }));
    } catch (e) {}
  }
}

export function resolveApiUrl(pathOrUrl) {
  if (!pathOrUrl || typeof pathOrUrl !== 'string') return '';
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  let base = getApiBaseUrl().replace(/\/+$/, '');
  let cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  // Prevent duplicate /api/api/ if base already includes /api
  if (base.endsWith('/api') && cleanPath.startsWith('/api/')) {
    cleanPath = cleanPath.slice(4);
  }
  return base ? `${base}${cleanPath}` : cleanPath;
}

export async function testApiConnection(customUrl = null) {
  const targetBase = customUrl !== null ? (customUrl || '').replace(/\/+$/, '') : getApiBaseUrl().replace(/\/+$/, '');
  const healthEndpoint = targetBase ? `${targetBase}/api/health` : '/api/health';

  try {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 6000) : null;

    const response = await fetch(healthEndpoint, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller ? controller.signal : undefined
    });

    if (timeoutId) clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();
    const trimmed = text.trim();

    if (trimmed.startsWith('<') || contentType.includes('text/html')) {
      return {
        ok: false,
        status: response.status,
        isHtml: true,
        endpoint: healthEndpoint,
        error: `Server responded with HTML page (${response.status}) instead of JSON. The backend server is not running at this address.`
      };
    }

    try {
      const data = trimmed ? JSON.parse(trimmed) : null;
      return {
        ok: response.ok,
        status: response.status,
        isHtml: false,
        endpoint: healthEndpoint,
        data,
        error: response.ok ? null : (data?.error || `Health check failed with status ${response.status}`)
      };
    } catch (e) {
      return {
        ok: false,
        status: response.status,
        isHtml: false,
        endpoint: healthEndpoint,
        error: 'Invalid JSON response from server'
      };
    }
  } catch (err) {
    return {
      ok: false,
      status: 0,
      isHtml: false,
      endpoint: healthEndpoint,
      error: err.name === 'AbortError' ? 'Connection timed out (6s)' : (err.message || 'Network connection failed')
    };
  }
}

export async function safeFetchJson(url, options = {}) {
  const targetUrl = resolveApiUrl(url);
  try {
    const response = await fetch(targetUrl, options);
    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();

    const trimmed = text.trim();

    // Check if the server returned HTML (SPA fallback, 404 HTML, or 500 error page)
    if (trimmed.startsWith('<') || contentType.includes('text/html')) {
      return {
        ok: false,
        status: response.status,
        isHtml: true,
        isNetworkError: false,
        data: null,
        error: `Server returned an HTML page (${response.status}) instead of JSON. The backend route (${targetUrl}) may not be running on this host.`
      };
    }

    try {
      const data = trimmed ? JSON.parse(trimmed) : null;
      return {
        ok: response.ok,
        status: response.status,
        isHtml: false,
        isNetworkError: false,
        data,
        error: response.ok ? null : (data?.error || data?.message || `Request failed with status ${response.status}`)
      };
    } catch (parseErr) {
      return {
        ok: false,
        status: response.status,
        isHtml: false,
        isNetworkError: false,
        data: null,
        error: `Invalid JSON response received from ${targetUrl}`
      };
    }
  } catch (netErr) {
    return {
      ok: false,
      status: 0,
      isHtml: false,
      isNetworkError: true,
      data: null,
      error: netErr.message || 'Network request failed'
    };
  }
}
