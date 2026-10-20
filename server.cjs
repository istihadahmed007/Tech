/**
 * CommonJS Entry Point for Hostinger / cPanel Phusion Passenger
 * Dynamically loads the authoritative ES Module production backend in ./server/server.js
 */
(async () => {
  try {
    const backend = await import('./server/server.js');
    module.exports = backend.server || backend.default;
  } catch (err) {
    console.error('[Startup Error] Failed to initialize server/server.js:', err);
    process.exit(1);
  }
})();

