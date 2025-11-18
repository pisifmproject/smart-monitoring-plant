import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',     // file schema buatanmu (lihat langkah 4/5)
  out: './drizzle',                 // folder migrations
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!, // pastikan ada di .env
  },
} satisfies Config;
