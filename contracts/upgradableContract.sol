// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Storage contract to manage the state
contract DiwiStorage {
    address public owner;
    
    struct PublicKeySubmission {
        string publicKey;
        bool exists;
    }

    struct DigitalWill {
        uint blockNumber;
        address signer;
        address recipient;
        PublicKeySubmission publicKeySubmission;
        string message;
    }
 
    mapping(address => address[]) public signerRecipients;
    mapping(address => address[]) public recipientSigner;
    mapping(address => mapping(address => PublicKeySubmission)) public publicKeys;
    mapping(address => DigitalWill[]) public wills;
}

// Implementation contract
contract DiwiImplementation is DiwiStorage {
    event PublicKeyRequested(address indexed from, address indexed to, string message);
    event PublicKeySubmitted(address indexed from, address indexed to, string publicKey);
    event MessageSent(address indexed from, address indexed to, DigitalWill will);
    // event MessageSent(address indexed from, address indexed to, string message);
    
    //initialize contract to proxy
    function initialize() public {
        require(owner == address(0), "Contract already initialized");
        owner = msg.sender;
    }
    modifier onlyPair(address signer) {
        require(isRecipientOfSigner(signer, msg.sender), "Only valid signer-recipient pair can submit public keys");
        _;
    }
    //is recipient of signer
    function isRecipientOfSigner(address signer, address recipient) internal view returns (bool) {
        address[] storage recipients = signerRecipients[signer];
        for (uint i = 0; i < recipients.length; i++) {
            if (recipients[i] == recipient) {
                return true;
            }
        }
        return false;
    }
    //is signer of recipient
    function isSignerOfRecipient(address recipient, address signer) internal view returns (bool) {
        address[] storage signers = recipientSigner[recipient];
        for (uint i = 0; i < signers.length; i++) {
            if (signers[i] == signer) {
                return true;
            }
        }
        return false;
    }
    //signer requests public key from a recipient
    function requestPublicKey(address recipient, string memory message) public {
        require(bytes(message).length > 0, "Message cannot be empty");
        if (!isRecipientOfSigner(msg.sender, recipient)) {
            signerRecipients[msg.sender].push(recipient);
            recipientSigner[recipient].push(msg.sender);
        }
        emit PublicKeyRequested(msg.sender, recipient, message);
    }
    //recipient sumbits public key to a signer
    function submitPublicKey(address signer, string memory publicKey) public onlyPair(signer) {
        require(bytes(publicKey).length > 0, "Public key cannot be empty");
        publicKeys[signer][msg.sender] = PublicKeySubmission(publicKey, true);
        emit PublicKeySubmitted(msg.sender, signer, publicKey);
    }
    //boolean to check if recipient has submitted public key
    function hasSubmittedPublicKey(address signer, address recipient) internal view returns (bool) {
        PublicKeySubmission storage submission = publicKeys[signer][recipient];
            if (submission.exists) {
                return true;
            }
        return false;
    }
    //send message to recipient
    function sendMessageToRecipient(address recipient, string memory message) public {
        require(isRecipientOfSigner(msg.sender, recipient), "Recipient is not associated with the signer");
        require(hasSubmittedPublicKey(msg.sender, recipient), "Recipient has not submitted a public key yet");
        require(bytes(message).length > 0, "Message cannot be empty");
        DigitalWill memory will = DigitalWill(block.number, msg.sender, recipient, publicKeys[msg.sender][recipient], message);
        wills[msg.sender].push(will);
        emit MessageSent(msg.sender, recipient, will);
    }
    //fetch public key of recipient
    function getPublicKeys(address recipient) public view returns (string memory) {
        PublicKeySubmission storage submissions = publicKeys[msg.sender][recipient];
        return submissions.publicKey;
    }
    //fetch recipients of signer
    function getRecipients(address signer) public view returns (address[] memory) {
        return signerRecipients[signer];
    }
    //fetch signers of recipient    
    function getSigners(address recipient) public view returns (address[] memory) {
        return recipientSigner[recipient];
    }
    //fetch all wills of signer
    function getAllWills(address signer) public view returns (DigitalWill[] memory) {
        return wills[signer];
    }
    //fetch all wills of recipient
    function getAllWillsOfRecipient(address recipient) public view returns (DigitalWill[] memory) {
        address[] memory signers = getSigners(recipient);
        DigitalWill[] memory allWills = new DigitalWill[](signers.length);
        for (uint i = 0; i < signers.length; i++) {
            allWills[i] = wills[signers[i]][i];
        }
        return allWills;
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