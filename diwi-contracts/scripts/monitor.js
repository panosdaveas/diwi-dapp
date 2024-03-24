const { getProvider, getContract, updateConsoleLog } = require("./utils.js")

async function monitor() {
    while (true) {
        latestBlock = await getProvider().eth.getBlockNumber();
        updateConsoleLog(`Latest block: ${latestBlock}`);
        getContract().events.GreetingChanged({
            fromBlock: latestBlock
        }, (error, event) => {
            if (error) console.error(error);
            console.log(event);
        })
            .on('data', (event) => {
                console.log('\n', event);
            })

        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

module.exports = {
    monitor,
};