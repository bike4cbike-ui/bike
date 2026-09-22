import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { ensureUser } from "@/lib/users";

export async function POST(req: NextRequest) {
  let evt: Awaited<ReturnType<typeof verifyWebhook>>;

  try {
    evt = await verifyWebhook(req);
  } catch (error) {
    console.error("Clerk webhook verification failed:", error);
    return new Response("Verification failed", { status: 400 });
  }

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const data = evt.data;
    const email =
      data.email_addresses.find(
        (entry) => entry.id === data.primary_email_address_id,
      )?.email_address ??
      data.email_addresses[0]?.email_address ??
      null;
    const name =
      [data.first_name, data.last_name].filter(Boolean).join(" ").trim() ||
      data.username ||
      null;

    await ensureUser({
      clerkId: data.id,
      email,
      name,
      imageUrl: data.image_url ?? null,
    });
  }

  return new Response("OK", { status: 200 });
}
