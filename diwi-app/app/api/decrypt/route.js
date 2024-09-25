import { timelockDecrypt } from "tlock-js";
import { quicknetClient } from "drand-client";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { ciphertext, dateTime } = await request.json();
  try {
    const client = await quicknetClient();
    const plaintext = await timelockDecrypt(ciphertext, client);
    // console.log(plaintext.toString());
    return NextResponse.json({ plaintext: plaintext.toString(), dateTime });
    console.log(NextResponse);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
