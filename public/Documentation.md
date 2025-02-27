## Notes

The drand network offers timelock encryption services without direct monetary costs to users. Here's how it works:

### Cost-Free Timelock Encryption:

- **Public Service**: The drand network, operated by the League of Entropy—a consortium of organizations including Cloudflare, Protocol Labs, and others—provides a distributed, verifiable randomness beacon as a public good. This service is freely accessible, allowing users to perform timelock encryption without incurring fees.
- **Operational Costs**: While users don't pay for access, the organizations running drand nodes bear operational expenses. These entities contribute resources to maintain the network, ensuring its reliability and availability.

### Message Size and Storage Considerations:

- **Hybrid Encryption**:
    1. **Asymmetric Encryption**: Encrypt your message using the recipient's RSA public key.
    2. **Timelock Encryption**: Encrypt the RSA-encrypted message using tlock-js to ensure it becomes decryptable only after a specified time.
- **Decryption Process**:
    1. **Timelock Decryption**: After the specified time has passed, decrypt the timelock-encrypted message using tlock-js.
    2. **Asymmetric Decryption**: Decrypt the message using your RSA private key.
- **Storage Responsibility**: It's important to note that while drand facilitates the encryption process, it doesn't store the encrypted messages. Users are responsible for storing and managing their ciphertexts securely until the designated decryption time.
___

### Implementation example of the Hybrid Encryption

```javascript
const crypto = require('crypto');
const { timelockEncrypt } = require('tlock-js');
const { DrandHttpClient, roundForTime } = require('drand-client');
const fetch = require('node-fetch'); // For environments without global fetch

// Initialize drand client
const drand = new DrandHttpClient({
  chainHash: '52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971', // Mainnet chain hash
  urls: ['https://api.drand.sh'], // Mainnet endpoint
  fetch,
});

// Function to perform hybrid encryption
async function hybridEncrypt(message, rsaPublicKey, unlockTime) {
  // 1. Asymmetric Encryption (RSA)
  const bufferMessage = Buffer.from(message, 'utf8');
  const encryptedMessage = crypto.publicEncrypt(
    {
      key: rsaPublicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    bufferMessage
  );

  // 2. Timelock Encryption of the RSA-encrypted message
  const roundNumber = await roundForTime(drand, unlockTime);
  const timelockEncryptedMessage = await timelockEncrypt(
    drand,
    roundNumber,
    encryptedMessage
  );

  // Return the timelock-encrypted message
  return timelockEncryptedMessage.toString('base64');
}

// Usage example
(async () => {
  const rsaPublicKey = `-----BEGIN PUBLIC KEY-----
  ...Your RSA Public Key Here...
  -----END PUBLIC KEY-----`;

  const message = 'This is a secret message.';
  const unlockTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

  const encryptedPayload = await hybridEncrypt(message, rsaPublicKey, unlockTime);
  console.log('Encrypted Payload:', encryptedPayload);
})();

```

### Implementation example of the Hybrid Decryption
```javascript
const { timelockDecrypt } = require('tlock-js');

// Function to perform hybrid decryption
async function hybridDecrypt(timelockEncryptedMessage, rsaPrivateKey) {
  // 1. Timelock Decryption to retrieve the RSA-encrypted message
  const decryptedTimelockMessage = await timelockDecrypt(
    drand,
    Buffer.from(timelockEncryptedMessage, 'base64')
  );

  // 2. Asymmetric Decryption (RSA) to retrieve the original message
  const decryptedMessage = crypto.privateDecrypt(
    {
      key: rsaPrivateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    decryptedTimelockMessage
  );

  return decryptedMessage.toString('utf8');
}

// Usage example
(async () => {
  const rsaPrivateKey = `-----BEGIN PRIVATE KEY-----
  ...Your RSA Private Key Here...
  -----END PRIVATE KEY-----`;

  // Assume timelockEncryptedMessage is obtained from the encryption step
  const decryptedMessage = await hybridDecrypt(timelockEncryptedMessage, rsaPrivateKey);
  console.log('Decrypted Message:', decryptedMessage);
})();

```
___
### Important Considerations:

- **Timelock Encryption Constraints**: The tlock-js library is designed to encrypt data that can be decrypted after a specified time, leveraging the drand network's randomness beacons. Ensure that your application can tolerate the delay imposed by the timelock encryption.
- **Security Assumptions**: The security of this scheme relies on the integrity of the drand network and the assumption that a threshold number of nodes do not collude to release randomness beacons prematurely. Additionally, ensure that your RSA keys are securely generated and stored.

___

**Sources**: 

[drand.love](https://drand.love/blog/2023/03/28/timelock-on-fastnet/)