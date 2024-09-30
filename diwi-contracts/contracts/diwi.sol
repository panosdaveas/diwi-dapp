//import solidity
pragma solidity ^0.8.0;

//set contract name
contract DiWi {
    //set contract state variables
    string public message;
    string public publicKey;
    string public privateKey;
    uint256 public dateTime;
    address public addressRecipient;

    //set contract constructor
    constructor(string memory _message, string memory _publicKey, string memory _privateKey, uint256 _dateTime, address _addressRecipient) {
        message = _message;
        publicKey = _publicKey;
        privateKey = _privateKey;
        dateTime = _dateTime;
        addressRecipient = _addressRecipient;
    }

    //set contract function
    function encrypt(string memory _message, string memory _publicKey, string memory _privateKey, uint256 _dateTime, address _addressRecipient) public {
        message = _message;
        publicKey = _publicKey;
        privateKey = _privateKey;
        dateTime = _dateTime;
        addressRecipient = _addressRecipient;
    }

    function decrypt(string memory _message, string memory _publicKey, string memory _privateKey, uint256 _dateTime, address _addressRecipient) public {
        message = _message;
        publicKey = _publicKey;
        privateKey = _privateKey;
        dateTime = _dateTime;
        addressRecipient = _addressRecipient;
    }