 HookFlow

HookFlow is an enterprise-grade webhook management and event processing system designed to reliably handle, rate-limit, and dispatch webhooks at scale.

 Tech Stack

- Framework: Next.js (App Router) / TypeScript
- Database & ORM: Neon PostgreSQL & Prisma ORM
- Queue & Background Processing: BullMQ & Upstash Redis
- Rate Limiting: Upstash Redis

 Features

- Reliable Event Queueing: Offloads webhook dispatches to background workers using BullMQ.
- Robust Rate Limiting: Restricts incoming requests (up to 100 requests/minute per client) to prevent abuse.
- Automated Retries: Safely retries failed webhook deliveries.

 Getting Started

1. Clone the repository and navigate into the folder:
   ''`bash
   git clone [https://github.com/your-username/hookflow.git](https://github.com/sisayyeabsira76-boop/hookflow.git)
   cd hookflow