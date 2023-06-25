import { z } from 'zod';
import MongoDBDatabase from './lib/database/MongoDBDatabase';

const envVariables = z.object({
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_API_KEY: z.string(),
  TIKTOK_CLIENT_KEY: z.string(),
  TIKTOK_CLIENT_SECRET: z.string(),
  SERVER_ROOT_URI: z.string(),
  UI_ROOT_URI: z.string(),
  JWT_SECRET: z.string(),
  COOKIE_NAME: z.string(),
  MONGODB_CONNECTION_STRING: z.string(),
  MONGODB_DB_NAME: z.string(),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
