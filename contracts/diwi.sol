// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Diwi {
    
    // Define the contract owner
    address public owner;
    
     // Struct to represent a public key submission
    struct PublicKeySubmission {
        string publicKey;
        bool exists;
    }

     // Mapping to store recipients for each signer
    mapping(address => address[]) public signerRecipients;

    // Mapping to store public keys for each signer-recipient pair
    mapping(address => mapping(address => PublicKeySubmission[])) public publicKeys;

    // Event to request the public key with a message
    event PublicKeyRequested(address indexed from, address indexed to, string message);

    // Event to store the response (recipient's public key)
    event PublicKeySubmitted(address indexed from, address indexed to, string publicKey);

    // Modifier to ensure only the pair (signer, recipient) can submit public keys
    modifier onlyPair(address signer) {
        require(isRecipientOfSigner(signer, msg.sender), "Only valid signer-recipient pair can submit public keys");
        _;
    }

    // Constructor to set the contract owner (UserA)
    constructor() {
        owner = msg.sender;
    }

    // Internal function to check if an address is a recipient of a signer
    function isRecipientOfSigner(address signer, address recipient) internal view returns (bool) {
        address[] storage recipients = signerRecipients[signer];
        for (uint i = 0; i < recipients.length; i++) {
            if (recipients[i] == recipient) {
                return true;
            }
        }
        return false;
    }

     // Function to request the public key of a recipient with a custom message
    function requestPublicKey(address recipient, string memory message) public {
        require(bytes(message).length > 0, "Message cannot be empty");
        if (!isRecipientOfSigner(msg.sender, recipient)) {
            signerRecipients[msg.sender].push(recipient);
        }
        emit PublicKeyRequested(msg.sender, recipient, message);
    }

    // Function for a recipient to respond with their public key
    function submitPublicKey(address signer, string memory publicKey) public onlyPair(signer) {
        require(bytes(publicKey).length > 0, "Public key cannot be empty");
        publicKeys[signer][msg.sender].push(PublicKeySubmission(publicKey, true));
        emit PublicKeySubmitted(msg.sender, signer, publicKey);
    }

     // Function to retrieve all public keys of a recipient for a specific signer
    function getPublicKeys(address recipient) public view returns (string[] memory) {
        PublicKeySubmission[] storage submissions = publicKeys[msg.sender][recipient];
        string[] memory keys = new string[](submissions.length);
        for (uint i = 0; i < submissions.length; i++) {
            keys[i] = submissions[i].publicKey;
        }
        return keys;
    }

    // Function to get recipients for a signer
    function getRecipients(address signer) public view returns (address[] memory) {
        return signerRecipients[signer];
    }

}