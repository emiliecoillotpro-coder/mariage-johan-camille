import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { password } = await request.json();
  const adminPw = process.env.ADMIN_PASSWORD;

  if (password === adminPw) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, debug: { hasEnv: !!adminPw, envLength: adminPw?.length } }, { status: 401 });
}
