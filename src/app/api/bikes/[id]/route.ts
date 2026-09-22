import { NextResponse } from "next/server";
import { getBikeCertificateById } from "@/lib/certificates";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const certificate = await getBikeCertificateById(id);
    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(certificate);
  } catch {
    return NextResponse.json(
      { error: "Could not load certificate. Try again." },
      { status: 500 },
    );
  }
}
