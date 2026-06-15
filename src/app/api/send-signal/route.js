import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        // 1. Website se data receive karein
        const body = await request.json();
        const signalMessage = body.message || "Test Signal";

        // 2. Apna asli Telebot Creator Webhook URL yahan dalein
        const telebotWebhookUrl = "https://api.telebotcreator.com/new-webhook?data=gAAAAABqL5ZeMDlOZ9BhZrT5BLdtPwhhpMoutT_g30gdWt6swX19HT3kW1UKGhx5QrrnBhApdVs1GclXTQhdl1jHD0lhx8jKUQ3D7TIxmuoUp93G_7hBsvjXKgjzq2TuUUGj1_HYg7KENTAgJCOraKl0ZVRyFfy2TKsNZ6tTj0kIGcJmlTkmowl39C5VU2pzXq_Izxbo1uql";

        // 3. Telebot Creator bot ko request bhejein
        const response = await fetch(telebotWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                data: signalMessage
            }),
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
