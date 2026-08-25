import { Worker } from 'bullmq';
import { redisConnection } from './lib/redis';

console.log("🚀 HookFlow Background Worker started and listening for jobs...");

const worker = new Worker(
  'webhook-delivery',
  async (job) => {
   
    console.log('[Worker] Attempt ${job.attemptsMade + 1} for job ${job.id}...');
    const { endpointUrl, payload } = job.data;

    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Endpoint responded with status ${response.status}');
    }

    console.log('✅ Job ${job.id} successfully delivered to ${endpointUrl}');
  },
  { connection: redisConnection }
);

worker.on('failed', (job, err) => {
  if (job) {
    // Single Quote (') ፈንታ Backtick () ተጠቅመናል
    console.log('⚠️ Job ${job.id} failed (Attempt ${job.attemptsMade}/${job.opts.attempts}): ${err.message}');
  }
});