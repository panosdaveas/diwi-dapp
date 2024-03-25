const { getContract, wallet } = require("./utils.js")

async function getGreeting() {
    const contract = await getContract();
    const call = await contract.methods.getGreeting().call();
    console.log(call);
}

async function setGreeting(message) {
    const contract = await getContract();
    const res = await contract.methods.setGreeting(message).send({ from: wallet.address, gas: 1000000 });
    console.log(res);
}

module.exports = {
    getGreeting,
    setGreeting,
};