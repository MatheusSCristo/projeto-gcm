/**
 * Front-end console: consome a API REST da loja.
 * Acessa apenas a API (nunca a camada de serviço diretamente).
 */
const API_URL = process.env.API_URL ?? "http://localhost:3000";

console.log("=== Loja Virtual ===");
console.log(`API: ${API_URL}`);
console.log("Menu ainda não implementado.");
