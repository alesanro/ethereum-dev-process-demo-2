var HDWalletProvider = require("truffle-hdwallet-provider")
var Web3 = require("web3")

function getWallet() {
  try{ 
    return require('fs').readFileSync("./wallet.json", "utf8").trim()
  } 
  catch(err) {
    return ""
  }
}

function getPassword() {
  try {
    return JSON.parse(require('fs').readFileSync("./secret.json", "utf8").trim())["password"]
  } 
  catch(err) {
    return ""
  }
}

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  networks: {
    private: {
      // provider: HDWalletProvider.WalletProvider(getWallet(), getPassword(), "http://127.0.0.1:8540"),
      host: "localhost",
      port: "8540",
      network_id: 74565,
      gasPrice: 0,
      gas: 4700000,
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
