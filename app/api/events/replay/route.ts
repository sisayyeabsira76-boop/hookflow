import { NextResponse } from "next/server";
import { webhookQueue } from "@/lib/queue";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { eventId } = await req.json();

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    // ከዳታቤዝ ላይ ዌብኮክ ክስተቱን መፈለግ
    const event = await db.payloadLog.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // ፔይሎዱን እንደገና ወደ BullMQ Queue መክተት
    await webhookQueue.add("dispatch-event", {
      endpointUrl: event.endpointUrl,
      payload: event.payload,
    });

    return NextResponse.json({ 
      success: true, 
      message: "Event replayed and queued successfully" 
    });
  } catch (error) {
    console.error("Replay error:", error);
    return NextResponse.json({ error: "Failed to replay event" }, { status: 500 });
  }
}