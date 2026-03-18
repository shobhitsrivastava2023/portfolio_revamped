import { NextRequest, NextResponse } from "next/server";
import { deletePowEventsOlderThanDays } from "../../../lib/pow/db";

const RETENTION_DAYS = 4;

export async function POST(request: NextRequest) {
  const expected = process.env.POW_RETENTION_TOKEN;
  if (expected) {
    const provided =
      request.headers.get("x-pow-token") ?? request.nextUrl.searchParams.get("token");
    if (!provided || provided !== expected) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  await deletePowEventsOlderThanDays(RETENTION_DAYS);
  return NextResponse.json({ ok: true, retentionDays: RETENTION_DAYS });
}

