// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Storage contract to manage the state
contract DiwiStorage {
    address public owner;
    
    struct PublicKeySubmission {
        string publicKey;
        bool exists;
    }
    
    mapping(address => address[]) public signerRecipients;
    mapping(address => mapping(address => PublicKeySubmission[])) public publicKeys;
}

// Implementation contract (your current Diwi contract with modifications)
contract DiwiImplementation is DiwiStorage {
    event PublicKeyRequested(address indexed from, address indexed to, string message);
    event PublicKeySubmitted(address indexed from, address indexed to, string publicKey);
    event MessageSent(address indexed from, address indexed to, string message);
    
    modifier onlyPair(address signer) {
        require(isRecipientOfSigner(signer, msg.sender), "Only valid signer-recipient pair can submit public keys");
        _;
    }
    
    function initialize() public {
        require(owner == address(0), "Contract already initialized");
        owner = msg.sender;
    }
    
    function isRecipientOfSigner(address signer, address recipient) internal view returns (bool) {
        address[] storage recipients = signerRecipients[signer];
        for (uint i = 0; i < recipients.length; i++) {
            if (recipients[i] == recipient) {
                return true;
            }
        }
        return false;
    }

    function hasSubmittedPublicKey(address signer, address recipient) internal view returns (bool) {
        PublicKeySubmission[] storage submissions = publicKeys[signer][recipient];
        for (uint i = 0; i < submissions.length; i++) {
            if (submissions[i].exists) {
                return true;
            }
        }
        return false;
    }
    
    function requestPublicKey(address recipient, string memory message) public {
        require(bytes(message).length > 0, "Message cannot be empty");
        if (!isRecipientOfSigner(msg.sender, recipient)) {
            signerRecipients[msg.sender].push(recipient);
        }
        emit PublicKeyRequested(msg.sender, recipient, message);
    }
    
    function submitPublicKey(address signer, string memory publicKey) public onlyPair(signer) {
        require(bytes(publicKey).length > 0, "Public key cannot be empty");
        publicKeys[signer][msg.sender].push(PublicKeySubmission(publicKey, true));
        emit PublicKeySubmitted(msg.sender, signer, publicKey);
    }
    
    function getPublicKeys(address recipient) public view returns (string[] memory) {
        PublicKeySubmission[] storage submissions = publicKeys[msg.sender][recipient];
        string[] memory keys = new string[](submissions.length);
        for (uint i = 0; i < submissions.length; i++) {
            keys[i] = submissions[i].publicKey;
        }
        return keys;
    }
    
    function getRecipients(address signer) public view returns (address[] memory) {
        return signerRecipients[signer];
    }

    function sendMessageToRecipient(address recipient, string memory message) public {
        require(isRecipientOfSigner(msg.sender, recipient), "Recipient is not associated with the signer");
        require(hasSubmittedPublicKey(msg.sender, recipient), "Recipient has not submitted a public key yet");
        require(bytes(message).length > 0, "Message cannot be empty");
        
        emit MessageSent(msg.sender, recipient, message);
    }
}

// Proxy contract
contract DiwiProxy {
    address public implementation;
    address public admin;
    
    constructor(address _implementation) {
        implementation = _implementation;
        admin = msg.sender;
    }
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    function upgrade(address newImplementation) public onlyAdmin {
        implementation = newImplementation;
    }
    
    fallback() external payable {
        address _impl = implementation;
        require(_impl != address(0), "Implementation contract not set");
        
        assembly {
            let ptr := mload(0x40)
            calldatacopy(ptr, 0, calldatasize())
            let result := delegatecall(gas(), _impl, ptr, calldatasize(), 0, 0)
            let size := returndatasize()
            returndatacopy(ptr, 0, size)
            
            switch result
            case 0 { revert(ptr, size) }
            default { return(ptr, size) }
        }
    }
    
    receive() external payable {}
}