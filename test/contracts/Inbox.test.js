const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const contracts  = require('../../scripts/compile');

const provider = ganache.provider();
const web3 = new Web3(provider);

describe('Inbox', () => {
    let accounts,
        inbox;

    const INITIAL_MESSAGE = "Hi there";

    beforeEach(async () => {
        accounts = await web3.eth.getAccounts();

        inbox = await new web3.eth.Contract(JSON.parse(contracts[':Inbox'].interface))
            .deploy({
                data: contracts[':Inbox'].bytecode,
                arguments: [ INITIAL_MESSAGE ]
            })
            .send({
                from: accounts[0],
                gas: '1000000'
            });

        inbox.setProvider(provider);
    });

    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('has an initial message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_MESSAGE);
    });

    it('can change the message', async () => {
        const newMessage = "Changed message";

        await inbox.methods.setMessage(newMessage).send({
            from: accounts[0]
        });

        const message = await inbox.methods.message().call();

        assert.equal(message, newMessage);
    });
});