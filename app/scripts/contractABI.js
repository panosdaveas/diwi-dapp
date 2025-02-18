const contractCurrentABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "publicKey",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "message",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "messageHash",
        type: "bytes32",
      },
    ],
    name: "MessageSent",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "digitalWills",
    outputs: [
      {
        internalType: "bytes32",
        name: "uniqueId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "signer",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "fulfilled",
        type: "bool",
      },
      {
        internalType: "string",
        name: "message",
        type: "string",
      },
      {
        internalType: "string",
        name: "publicKey",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "messageHash",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllWills",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "uniqueId",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "bool",
            name: "exists",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "fulfilled",
            type: "bool",
          },
          {
            internalType: "string",
            name: "message",
            type: "string",
          },
          {
            internalType: "string",
            name: "publicKey",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "blockNumber",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "messageHash",
            type: "bytes32",
          },
        ],
        internalType: "struct DiwiStorage.DigitalWill[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "uniqueId",
        type: "bytes32",
      },
    ],
    name: "getWillByUniqueId",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "uniqueId",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "bool",
            name: "exists",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "fulfilled",
            type: "bool",
          },
          {
            internalType: "string",
            name: "message",
            type: "string",
          },
          {
            internalType: "string",
            name: "publicKey",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "blockNumber",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "messageHash",
            type: "bytes32",
          },
        ],
        internalType: "struct DiwiStorage.DigitalWill",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "getWillsByRecipient",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "uniqueId",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "bool",
            name: "exists",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "fulfilled",
            type: "bool",
          },
          {
            internalType: "string",
            name: "message",
            type: "string",
          },
          {
            internalType: "string",
            name: "publicKey",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "blockNumber",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "messageHash",
            type: "bytes32",
          },
        ],
        internalType: "struct DiwiStorage.DigitalWill[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "signer",
        type: "address",
      },
    ],
    name: "getWillsBySigner",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "uniqueId",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "bool",
            name: "exists",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "fulfilled",
            type: "bool",
          },
          {
            internalType: "string",
            name: "message",
            type: "string",
          },
          {
            internalType: "string",
            name: "publicKey",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "blockNumber",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "messageHash",
            type: "bytes32",
          },
        ],
        internalType: "struct DiwiStorage.DigitalWill[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "requestPublicKey",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "uniqueId",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "sendWillToRecipient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "uniqueId",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "publicKey",
        type: "string",
      },
    ],
    name: "submitPublicKey",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "message",
        type: "string",
      },
      {
        internalType: "bytes32",
        name: "storedHash",
        type: "bytes32",
      },
    ],
    name: "verifyMessage",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

export { contractCurrentABI };