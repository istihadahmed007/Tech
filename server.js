/**
 * Tech Nest Accessories Production Server Entry Point
 * Delegates directly to the authoritative backend in ./server/server.js
 * Supports Phusion Passenger, cPanel, Node.js clusters, and local deployments.
 */
import { 
  server, 
  handleServerRequest, 
  resolveSecureStaticPath, 
  decodePathRecursively 
} from './server/server.js';

export { 
  server, 
  handleServerRequest, 
  resolveSecureStaticPath, 
  decodePathRecursively 
};

export default server;
