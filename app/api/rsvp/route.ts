import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SUPABASE_URL = "https://dsmtdkqkxzbjmaltunut.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzbXRka3FreHpiam1hbHR1bnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNTgxMDcsImV4cCI6MjA4ODYzNDEwN30.pByNsQ2_okeG9sLfpC799AOxWrXaaM81mwmMXkTWTsY";

export async function POST(request: Request) {
  const body = await request.json();

  const res = await fetch(`${SUPABASE_URL}/rest/v1/rsvp_responses`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    return NextResponse.json({ error: errText }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
