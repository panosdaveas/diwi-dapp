// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

// Declares a contract named `HelloWorld`
contract HelloWorld {

    event GreetingChanged(string newGreeting);

    // Private state variable to store the string 'greeting'
    string private greeting;

    // Constructor function that initializes the contract
    // with a 'greeting' when it is deployed to the blockchain.
    constructor(string memory initialGreeting) {
        greeting = initialGreeting;
    }

    // Function to set the 'greeting' state variable
    function setGreeting(string memory newGreeting) public {
        emit GreetingChanged(newGreeting);
        greeting = newGreeting;
    }

    // Function to get the current value of the 'greeting' state variable
    function getGreeting() public view returns (string memory) {
        return greeting;
    }
}
