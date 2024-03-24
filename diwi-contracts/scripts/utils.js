const { Web3 } = require('web3')

if (!process.env.PRIVATE_KEY) {
    console.error("PRIVATE_KEY environment variable is not set");
    process.exit(1);
}

const contractAddress = process.env.CONTRACT_ADDRESS;
if (!contractAddress) {
    console.error("CONTRACT_ADDRESS environment variable is not set");
    process.exit(1);
}
console.log(`Using contract address: ${contractAddress}`);

const defaultProvider = 'http://127.0.0.1:7545';
var provider = process.env.PROVIDER
if (!provider) {
    console.warn("PROVIDER environment variable is not set, using", defaultProvider);
    provider = defaultProvider;
}

var web3Provider = new Web3.providers.HttpProvider(provider);
var web3 = new Web3(web3Provider);

var wallet = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(wallet);

const contractABI = require('../build/contracts/HelloWorld.json').abi;

function getProvider() {
    return web3
}

function getContract() {
    return new web3.eth.Contract(contractABI, contractAddress);
}

function updateConsoleLog(message) {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(message);
}

module.exports = {
    getProvider,
    getContract,
    updateConsoleLog,
    wallet,
};