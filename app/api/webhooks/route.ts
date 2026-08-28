import { NextResponse } from "next/server";
import { webhookQueue } from "@/lib/queue";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const identifier = req.headers.get("x-endpoint-id") || "default-client";
    const windowKey = 'rate_limit:${identifier}:${Math.floor(Date.now() / 60000)}';
    const current = await redis.incr(windowKey);
    
    if (current === 1) {
      await redis.expire(windowKey, 60);
    }

    if (current > 100) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Maximum 100 requests per minute allowed." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { endpointUrl, payload } = body;

    await webhookQueue.add("dispatch-event", {
      endpointUrl,
      payload,
    });

    return NextResponse.json({ success: true, message: "Webhook queued", remaining: 100 - current });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}