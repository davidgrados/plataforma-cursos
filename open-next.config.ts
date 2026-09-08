import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Sin R2 por ahora (no está habilitado). Cuando habilites R2 y crees el bucket,
// añade el cache incremental con R2 (ver docs de OpenNext/Caching).
export default defineCloudflareConfig({});
