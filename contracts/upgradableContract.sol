// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Storage contract to manage the state
contract DiwiStorage {
    address public owner;
    
    struct PublicKeyRequest {
        bool exists;
        bool fulfilled;
        string message;
        string publicKey;
    }

    struct DigitalWill {
        uint blockNumber;
        address signer;
        address recipient;
        string publicKey;
        string message;
    }
 
    // Mapping from signer to recipient to request details
    mapping(address => mapping(address => PublicKeyRequest)) public publicKeyRequests;
    
    // Array of all digital wills
    DigitalWill[] public digitalWills;
}

// Implementation contract
contract DiwiImplementation is DiwiStorage {
    event PublicKeyRequested(address indexed from, address indexed to, string message);
    event PublicKeySubmitted(address indexed from, address indexed to, string publicKey);
    event MessageSent(address indexed from, address indexed to, DigitalWill will);
    
    function initialize() public {
        require(owner == address(0), "Contract already initialized");
        owner = msg.sender;
    }

    modifier requestExists(address signer, address recipient) {
        require(publicKeyRequests[signer][recipient].exists, "Request does not exist");
        _;
    }

    modifier requestFulfilled(address signer, address recipient) {
        require(publicKeyRequests[signer][recipient].fulfilled, "Public key not submitted yet");
        _;
    }

    function requestPublicKey(address recipient, string memory message) public {
        require(bytes(message).length > 0, "Message cannot be empty");
        
        // Update or create new request
        publicKeyRequests[msg.sender][recipient] = PublicKeyRequest({
            exists: true,
            fulfilled: false,
            message: message,
            publicKey: ""
        });
        
        emit PublicKeyRequested(msg.sender, recipient, message);
    }

    function submitPublicKey(address signer, string memory publicKey) public 
        requestExists(signer, msg.sender)
    {
        require(bytes(publicKey).length > 0, "Public key cannot be empty");
        
        PublicKeyRequest storage request = publicKeyRequests[signer][msg.sender];
        request.publicKey = publicKey;
        request.fulfilled = true;
        
        emit PublicKeySubmitted(msg.sender, signer, publicKey);
    }

    function sendMessageToRecipient(address recipient, string memory message) public 
        requestExists(msg.sender, recipient)
        requestFulfilled(msg.sender, recipient)
    {
        require(bytes(message).length > 0, "Message cannot be empty");
        
        DigitalWill memory will = DigitalWill({
            blockNumber: block.number,
            signer: msg.sender,
            recipient: recipient,
            publicKey: publicKeyRequests[msg.sender][recipient].publicKey,
            message: message
        });
        
        digitalWills.push(will);
        
        emit MessageSent(msg.sender, recipient, will);
    }

    // Get requests made by a signer
    function getSignerRequests(address recipient) public view returns (
        bool exists,
        bool fulfilled,
        string memory message,
        string memory publicKey
    ) {
        PublicKeyRequest storage request = publicKeyRequests[msg.sender][recipient];
        return (request.exists, request.fulfilled, request.message, request.publicKey);
    }

    // Get requests received from a signer
    function getRecipientRequest(address signer) public view returns (
        bool exists,
        bool fulfilled,
        string memory message,
        string memory publicKey
    ) {
        PublicKeyRequest storage request = publicKeyRequests[signer][msg.sender];
        return (request.exists, request.fulfilled, request.message, request.publicKey);
    }

    // Get all wills
    function getAllWills() public view returns (DigitalWill[] memory) {
        return digitalWills;
    }

    // Get wills by signer
    function getWillsBySigner(address signer) public view returns (DigitalWill[] memory) {
        // First, count the number of wills for this signer
        uint count = 0;
        for (uint i = 0; i < digitalWills.length; i++) {
            if (digitalWills[i].signer == signer) {
                count++;
            }
        }

        // Create array of correct size and populate it
        DigitalWill[] memory signerWills = new DigitalWill[](count);
        uint currentIndex = 0;
        for (uint i = 0; i < digitalWills.length; i++) {
            if (digitalWills[i].signer == signer) {
                signerWills[currentIndex] = digitalWills[i];
                currentIndex++;
            }
        }

        return signerWills;
    }

    // Get wills by recipient
    function getWillsByRecipient(address recipient) public view returns (DigitalWill[] memory) {
        // First, count the number of wills for this recipient
        uint count = 0;
        for (uint i = 0; i < digitalWills.length; i++) {
            if (digitalWills[i].recipient == recipient) {
                count++;
            }
        }

        // Create array of correct size and populate it
        DigitalWill[] memory recipientWills = new DigitalWill[](count);
        uint currentIndex = 0;
        for (uint i = 0; i < digitalWills.length; i++) {
            if (digitalWills[i].recipient == recipient) {
                recipientWills[currentIndex] = digitalWills[i];
                currentIndex++;
            }
        }

        return recipientWills;
    }
}

// Proxy contract remains the same
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