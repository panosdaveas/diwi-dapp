// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Storage contract to manage the state
contract DiwiStorage {
    address public owner;

    struct DigitalWill {
        bytes32 uniqueId; // Unique identifier for the will
        address signer;
        address recipient;
        bool exists;
        bool fulfilled;
        string message;
        string publicKey;
        uint blockNumber;
        bytes32 messageHash; // Changed to store hash instead of full message
    }

    // Array of all digital wills
    DigitalWill[] public digitalWills;
}

// Implementation contract
contract DiwiImplementation is DiwiStorage {
    // Modified to include the full message in the event
    event MessageSent(
        address indexed from,
        address indexed to,
        uint blockNumber,
        string publicKey,
        string message, // Full message in event
        bytes32 messageHash // Hash for verification
    );

    function initialize() public {
        require(owner == address(0), "Contract already initialized");
        owner = msg.sender;
    }

    // Get will by unique ID
    function getWillByUniqueId(bytes32 uniqueId) public view returns (DigitalWill memory) {
        for (uint i = 0; i < digitalWills.length; i++) {
            if (digitalWills[i].uniqueId == uniqueId) {
                return digitalWills[i];
            }
        }
        revert("Will not found");
    }

    modifier requestExists(bytes32 uniqueId) {
        require(
            getWillByUniqueId(uniqueId).exists,
            "Request does not exist"
        );
        _;
    }

    modifier requestFulfilled(bytes32 uniqueId) {
        require(
            getWillByUniqueId(uniqueId).fulfilled,
            "Public key not submitted yet"
        );
        _;
    }

    // Added modifier to restrict access to the recipient
    modifier onlyRecipient(address recipient) {
        require(msg.sender == recipient, "Only the recipient can perform this action");
        _;
    }

    // Added modifier to restrict access to the signer
    modifier onlySigner(address signer) {
        require(msg.sender == signer, "Only the signer can perform this action");
        _;
    }

    // Request a public key from a recipient
    function requestPublicKey(
        address recipient, 
        string memory message
    ) public {
        require(bytes(message).length > 0, "Message cannot be empty");

        // Generate a unique identifier for the will
        bytes32 uniqueId = keccak256(
            abi.encodePacked(msg.sender, recipient, block.timestamp)
        );

        DigitalWill memory will = DigitalWill({
            uniqueId: uniqueId,
            signer: msg.sender,
            recipient: recipient,
            exists: true,
            fulfilled: false,
            message: message,
            publicKey: "",
            blockNumber: 0,
            messageHash: 0
        });

        digitalWills.push(will);
    }

    // Submit a public key to a signer
    function submitPublicKey(
        bytes32 uniqueId,
        string memory publicKey
    ) public
        onlyRecipient(getWillByUniqueId(uniqueId).recipient)
        requestExists(uniqueId)
    {
        require(bytes(publicKey).length > 0, "Public key cannot be empty");
        for (uint i = 0; i < digitalWills.length; i++) {
            if (digitalWills[i].uniqueId == uniqueId) {
            digitalWills[i].publicKey = publicKey;
            digitalWills[i].fulfilled = true;
            break;
            }
        }
    }

    function sendWillToRecipient(
        bytes32 uniqueId,
        string memory message
    )
        public
        onlySigner(getWillByUniqueId(uniqueId).signer)
        requestExists(uniqueId)
        requestFulfilled(uniqueId)
    {
        require(bytes(message).length > 0, "Message cannot be empty");

        bytes32 messageHash = keccak256(bytes(message));

        uint i;
        for (i = 0; i < digitalWills.length; i++) {
            if (digitalWills[i].uniqueId == uniqueId) {
            digitalWills[i].blockNumber = block.number;
            digitalWills[i].messageHash = messageHash;
            break;
            }
        }

        // Emit the full message in the event
        emit MessageSent(
            msg.sender,
            digitalWills[i].recipient,
            digitalWills[i].blockNumber,
            digitalWills[i].publicKey,
            digitalWills[i].message, // Full message in event
            digitalWills[i].messageHash // Hash for verification
        );

    }

    // Helper function to verify a message matches a stored hash
    function verifyMessage(
        string memory message,
        bytes32 storedHash
    ) public pure returns (bool) {
        return keccak256(bytes(message)) == storedHash;
    }

    // Get all wills (now returns hashes instead of full messages)
    function getAllWills() public view returns (DigitalWill[] memory) {
        return digitalWills;
    }

    // Get wills by signer
    function getWillsBySigner(
        address signer
    ) public view returns (DigitalWill[] memory) {
        uint count = 0;
        for (uint i = 0; i < digitalWills.length; i++) {
            if (digitalWills[i].signer == signer) {
                count++;
            }
        }

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
    function getWillsByRecipient(
        address recipient
    ) public view returns (DigitalWill[] memory) {
        uint count = 0;
        for (uint i = 0; i < digitalWills.length; i++) {
            if (digitalWills[i].recipient == recipient) {
                count++;
            }
        }

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

// Proxy contract remains unchanged
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
            case 0 {
                revert(ptr, size)
            }
            default {
                return(ptr, size)
            }
        }
    }

    receive() external payable {}
}
