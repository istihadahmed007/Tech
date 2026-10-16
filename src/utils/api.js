/**
 * Bulletproof API Fetch Utility for Glacial Tech Accessories Storefront
 * 
 * Safely handles JSON parsing, network errors, and unexpected HTML responses 
 * (e.g. 404/500/SPA fallback <!DOCTYPE html>...) which would otherwise trigger:
 * "SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON"
 */

export async function safeFetchJson(url, options = {}) {
  try {
    const response = await fetch(url, options);
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
        error: `Server returned an HTML page (${response.status}) instead of JSON. The backend route (${url}) may not be running on this host.`
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
        error: `Invalid JSON response received from ${url}`
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
