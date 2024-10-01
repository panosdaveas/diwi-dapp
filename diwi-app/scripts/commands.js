const commander = require('commander');
const { getGreeting, setGreeting } = require('./methods');
const { monitor } = require('./monitor');

const program = new commander.Command();

program
    .command('get')
    .action(() => {
        getGreeting();
    });

program
    .command('set')
    .argument('message', 'new greeting message')
    .action((message) => {
        setGreeting(message);
    });

program
    .command('monitor')
    .action(async () => {
        await monitor();
    });


program.parse();