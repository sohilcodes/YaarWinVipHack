import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        // 1. Aapki website jo signal generate karegi, uska data yahan receive hoga
        const body = await request.json();
        
        // Maan lete hain aapki website signal ka text 'message' key me bhejti hai
        const signalMessage = body.message || "Naya signal aaya hai!";

        // 2. Telebot Creator ka asli Webhook URL yahan dalein
        // (Jo aapko bot me libs.Webhook.getUrlFor("receive_signal") se milega)
        const telebotWebhookUrl = "https://api.telebotcreator.com/new-webhook?data=gAAAAABqL5ZeMDlOZ9BhZrT5BLdtPwhhpMoutT_g30gdWt6swX19HT3kW1UKGhx5QrrnBhApdVs1GclXTQhdl1jHD0lhx8jKUQ3D7TIxmuoUp93G_7hBsvjXKgjzq2TuUUGj1_HYg7KENTAgJCOraKl0ZVRyFfy2TKsNZ6tTj0kIGcJmlTkmowl39C5VU2pzXq_Izxbo1uql";

        // 3. Next.js server se direct Telebot Creator ko POST request bhejein
        const response = await fetch(telebotWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Data ko 'signal' naam ki key me wrap karke bhej rahe hain
            body: JSON.stringify({
                signal: signalMessage
            }),
        });

        if (!response.ok) {
            throw new Error('Bot webhook response was not ok');
        }

        return NextResponse.json({ success: true, message: "Signal successfully sent to Telegram Bot!" });

    } catch (error) {
        console.error("Webhook forwarding error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
                                  }
