import { type PlatformProxy } from "wrangler";
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
    env: {
      TURSO_DB_URL: string;
      TURSO_DB_AUTH_TOKEN: string;
    };
  }
}

// Make environment variables available to the app
process.env.TURSO_DB_URL = process.env.TURSO_DB_URL || '';
process.env.TURSO_DB_AUTH_TOKEN = process.env.TURSO_DB_AUTH_TOKEN || '';