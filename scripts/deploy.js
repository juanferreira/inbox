require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const contracts = require('./compile');

const mnemonic = process.env.MNEMONIC;
const network = process.env.NETWORK;

const provider = new HDWalletProvider(mnemonic, network);

const web3 = new Web3(provider);

const deploy = async () => {
    try{
        const accounts = await web3.eth.getAccounts();

        const result = await new web3.eth.Contract(JSON.parse(contracts[':Inbox'].interface))
                .deploy({
                    data: contracts[':Inbox'].bytecode,
                    arguments: [ 'Hi there!' ]
                })
                .send({
                    from: accounts[0],
                    gas: '1000000'
                });

        console.log('Contract deployed to ', result.options.address);
    } catch(e) {
        console.error(e);
    }
};

deploy();