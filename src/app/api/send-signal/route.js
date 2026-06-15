import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        // Website ka signal text nikaalein
        const signalMessage = body.message || "Test Signal from Website";

        const telebotWebhookUrl = "https://api.telebotcreator.com/new-webhook?data=gAAAAABqL5ZeMDlOZ9BhZrT5BLdtPwhhpMoutT_g30gdWt6swX19HT3kW1UKGhx5QrrnBhApdVs1GclXTQhdl1jHD0lhx8jKUQ3D7TIxmuoUp93G_7hBsvjXKgjzq2TuUUGj1_HYg7KENTAgJCOraKl0ZVRyFfy2TKsNZ6tTj0kIGcJmlTkmowl39C5VU2pzXq_Izxbo1uql";

        // Telebot Creator ke standard parser ke liye hum application/x-www-form-urlencoded ya clean string JSON bhejenge
        const response = await fetch(telebotWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            // Pure stringify format me bhej rahe hain bina nested extra layers ke
            body: JSON.stringify({
                data: signalMessage
            }),
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
}
