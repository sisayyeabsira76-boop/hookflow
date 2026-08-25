import { Queue } from 'bullmq';
import { redisConnection } from './redis';

export const webhookQueue = new Queue('webhook-delivery', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 3000,
    },
    removeOnComplete: true,
  },
});