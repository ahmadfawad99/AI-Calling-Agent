import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text, voiceId = "pNInz6obpgDQGcFmaJgB" } = await req.json();
  const apiKey = process.env.ELEVENLABS_API_KEY;

  // Fallback: if no API key, tell client to use browser TTS
  if (!apiKey) {
    return NextResponse.json({ fallback: true });
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_flash_v2_5",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json({ fallback: true });
    }

    const arrayBuffer = await response.arrayBuffer();
    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(arrayBuffer.byteLength),
      },
    });
  } catch {
    return NextResponse.json({ fallback: true });
  }
}
