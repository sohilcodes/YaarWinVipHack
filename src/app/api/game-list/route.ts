import { NextResponse } from "next/server";

const GAME_LIST_URL = "https://api.ar-lottery01.com/api/Lottery/GetGameList";

export async function GET() {
  try {
    const res = await fetch(GAME_LIST_URL, {
      headers: {
        "Accept":     "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; WinGoAnalytics/1.0)",
      },
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Upstream error" }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[game-list API]", err);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
