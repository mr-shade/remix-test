import { createClient } from '@libsql/client';

// Create a Turso client using environment variables
export function getDb(env?: any) {
  // Get environment variables from context or from wrangler.toml vars
  const url = env?.TURSO_DB_URL || 'libsql://remix-test-sh20raj.aws-ap-south-1.turso.io';
  const authToken = env?.TURSO_DB_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDY4NDYzNDYsImlkIjoiNWFlOTBmZTItOGMwOC00MGI1LTkwZTEtNDQwYjBhNGI3MTczIiwicmlkIjoiMjc5ODUzZWUtZThhZi00MjdjLWFmZjAtZWQ0ZTQzMWE0ZWFlIn0.D9V5B_T-k8GxtTTT-v59l4mZVKRtawYbEQUGtU_zO3isqERhGUIahK65b-pgYv368jm99yMfb6F9vTQq6AcZCg';

  return createClient({
    url,
    authToken,
  });
}

// Default client for non-Cloudflare environments (local development)
export const db = getDb();

// Initialize the database with the notes table if it doesn't exist
export async function initializeDb(env?: any) {
  const client = env ? getDb(env) : db;

  await client.execute(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);

  return client;
}
