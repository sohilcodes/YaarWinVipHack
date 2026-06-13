import { NextRequest, NextResponse } from "next/server";

const HISTORY_BASE = "https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page     = searchParams.get("page")     ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "50";

  try {
    const url = `${HISTORY_BASE}?pageNo=${page}&pageSize=${pageSize}&language=0`;
    const res = await fetch(url, {
      headers: {
        "Accept":       "application/json",
        "Referer":      "https://draw.ar-lottery01.com/",
        "User-Agent":   "Mozilla/5.0 (compatible; WinGoAnalytics/1.0)",
      },
      next: { revalidate: 5 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream error", status: res.status },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[history API]", err);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
