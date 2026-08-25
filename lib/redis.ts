import 'dotenv/config';
import { Redis } from 'ioredis';

const redisUrl = process.env.UPSTASH_REDIS_URL;

if (!redisUrl) {
  throw new Error('UPSTASH_REDIS_URL is not defined in .env file');
}

export const redisConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  tls: {
    rejectUnauthorized: false,
  },
});