#  Demo 2. Ethereum development tools & services: smart contracts

Here is presented couple of smart contracts and several approaches how to manage their development process, testing, compilation and deployment.

Tools that we see here:
- Remix IDE and remixd
- Truffle + Ganache

### Remix IDE

Allows to write, compile and fast prototype smart contracts right into a browser and does not require to install compiler, web3 and other development things. Only thing you need (at least to store your contracts locally and at the same time use Remix to develop them) is `remixd` package. It provides a connection between Remix IDE and local host to share contracts' folder and make instant changes. Link to Remix IDE you can find [here](http://remix.ethereum.org).

To run `remixd` just execute
```bash
npm run remixshare
```

### Truffle + Ganache

The most _engineering_ way to write smart contracts. More info you can get [here](http://truffleframework.com/docs/).

Contracts could be used in any network where they are deployed. Preconfigured set of networks includes:
- **private** - connects to a running Ethereum client

- **test** - is used for running tests and intended to execute with Ganache RPC client.

To run test RPC client execute
```bash
npm run run:rpc
```

To build smart contracts on ether `private` or `test` network run

```bash
npm run build:private
```

or

```bash
npm run build
```


### Support tools

Includes linters and security checkers.
The full list of them you can get [here](https://ethereum.stackexchange.com/a/38861).

Some of these tools are presented here such as `solium` and `eslint`.

To run `solium` linter execute
```bash
npm run lint:sol
```

and to run `eslint` execute
```bash
npm run lint:js
```