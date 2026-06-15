import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  try {
    const res = await fetch(`https://api.telegram.org/bot7398067602:AAHJ8aeUG3WLrqW82glcr-JURiJ1gk1oERc/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: "@fakeagents21", text, parse_mode: "Markdown" }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
