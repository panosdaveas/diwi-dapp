// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PublicKeyRequestWithMessage {
    // Define the contract owner (UserA)
    address public owner;
    
    // Mapping to store public keys of different users
    mapping(address => string) public publicKeys;

    // Event to request the public key with a message
    event PublicKeyRequested(address indexed from, address indexed to, string message);

    // Event to store the response (UserB's public key)
    event PublicKeySubmitted(address indexed from, string publicKey);

    // Modifier to ensure only the contract owner can request public keys
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can request public keys");
        _;
    }

    // Constructor to set the contract owner (UserA)
    constructor() {
        owner = msg.sender;
    }

    // Function to request the public key of UserB with a custom message
    function requestPublicKey(address userB, string memory message) public onlyOwner {
        // message = "Please send your public key for secure communication.";
        require(bytes(message).length > 0, "Message cannot be empty");
        emit PublicKeyRequested(msg.sender, userB, message);
    }

    // Function for UserB to respond with their public key
    function submitPublicKey(string memory publicKey) public {
        require(bytes(publicKey).length > 0, "Public key cannot be empty");

        // Store the public key
        publicKeys[msg.sender] = publicKey;

        emit PublicKeySubmitted(msg.sender, publicKey);
    }

    // Function to retrieve the public key of a user
    function getPublicKey(address user) public view returns (string memory) {
        return publicKeys[user];
    }
}
