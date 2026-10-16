/**
 * Production Application Entry Point
 * Used by Hostinger Node.js, cPanel, Passenger, Render, Railway, and Docker
 */
import { server } from './server/server.js';

export default server;
export { server };

