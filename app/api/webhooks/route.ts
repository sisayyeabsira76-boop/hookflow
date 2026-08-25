import { NextResponse } from "next/server";
import { webhookQueue } from "@/lib/queue";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { endpointUrl, payload } = body;

    // BullMQ Queue ውስጥ መክተት
    await webhookQueue.add("dispatch-event", {
      endpointUrl,
      payload,
    });

    return NextResponse.json({ success: true, message: "Event queued successfully" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}