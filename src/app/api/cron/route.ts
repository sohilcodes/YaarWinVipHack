import { NextResponse } from "next/server";

const TOKEN = "7398067602:AAHJ8aeUG3WLrqW82glcr-JURiJ1gk1oERc";
const CHAT  = "@fakeagents21";

function getColor(num: number): string {
  if (num === 0) return "🔴🟣 Red+Violet";
  if (num === 5) return "🟢🟣 Green+Violet";
  if ([1, 3, 7, 9].includes(num)) return "🟢 Green";
  return "🔴 Red";
}

export async function GET() {
  try {
    const res = await fetch(
      `https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json?ts=${Date.now()}`,
      { cache: "no-store" }
    );
    const json = await res.json();
    const list = json?.data?.list ?? [];
    if (!list.length) return NextResponse.json({ error: "no data" });

    const last10     = list.slice(0, 10);
    const bigCount   = last10.filter((r: {number: number}) => Number(r.number) >= 5).length;
    const smallCount = 10 - bigCount;
    const prediction = bigCount > smallCount ? "SMALL" : "BIG";
    const confidence = Math.max(bigCount, smallCount) * 10;
    const latest     = list[0];
    const nextPeriod = (BigInt(latest.issueNumber) + BigInt(1)).toString();
    const reason     = bigCount > smallCount
      ? `Big heavy (${bigCount}/10) → Small predicted`
      : `Small heavy (${smallCount}/10) → Big predicted`;

    const msg =
      `🏆 *YAARWIN VIP SIGNAL*\n\n` +
      `📍 Period: \`${nextPeriod}\`\n` +
      `🎯 Prediction: *${prediction}*\n` +
      `📊 Confidence: ${confidence}%\n` +
      `📈 Analysis: ${reason}\n` +
      `🔢 Last Result: ${latest.number} ${getColor(Number(latest.number))}\n\n` +
      `⚠️ _For entertainment only_`;

    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT, text: msg, parse_mode: "Markdown" }),
    });

    return NextResponse.json({ ok: true, period: nextPeriod, prediction });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
