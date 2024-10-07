// import { timelockEncrypt,timelockDecrypt, roundAt } from "tlock-js";
// import { quicknetClient } from "drand-client";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//   const { message, dateTime } = await request.json();
//   try {
//     const client = await quicknetClient();
//     const chainInfo = await client.chain().info();
//     const roundNumber = await roundAt(Date.now(), chainInfo);
//     const ciphertext = await timelockDecrypt(
//       roundNumber,
//       Buffer.from(message),
//       client
//     );
//     return NextResponse.json({ ciphertext: ciphertext, dateTime });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
