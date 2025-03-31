import { timelockDecrypt, roundTime } from "tlock-js";
import { quicknetClient } from "drand-client";
import { NextResponse } from "next/server";
import { MAINNET_CHAIN_INFO } from "tlock-js/drand/defaults";

export function errorMessage(err) {
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === "string") {
    return err;
  }

  return "Unknown error";
}


export function localisedDecryptionMessageOrDefault(err) {
  const message = errorMessage(err);
  const tooEarlyToDecryptErrorMessage =
    "It's too early to decrypt the ciphertext - decryptable at round ";

  if (!message.startsWith(tooEarlyToDecryptErrorMessage)) {
    return "There was an error during decryption! Is your ciphertext valid?";
  }

  const roundNumber = Number.parseInt(
    message.split(tooEarlyToDecryptErrorMessage)[1]
  );
  const timeToDecryption = new Date(roundTime(MAINNET_CHAIN_INFO, roundNumber));
  return `This message cannot be decrypted until ${timeToDecryption.toLocaleDateString()} at ${timeToDecryption.toLocaleTimeString()}`;
}

export async function POST(request) {
  const { message } = await request.json();
  try {
    const client = await quicknetClient();
    const ciphertext = await timelockDecrypt(message, client);
    return NextResponse.json({ decrypted: ciphertext.toString(), });
  } catch (error) {
    return NextResponse.json({ error: localisedDecryptionMessageOrDefault(error) }, { status: 500 });
  }
  return;
}
