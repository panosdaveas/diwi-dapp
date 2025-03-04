import { timelockDecrypt } from "tlock-js";
import { quicknetClient } from "drand-client";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { message } = await request.json();
  try {
    const client = await quicknetClient();
    const cyphertext = await timelockDecrypt(message, client);
    return NextResponse.json({ decrypted: cyphertext.toString(), });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return;
}
