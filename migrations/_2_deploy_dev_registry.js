const DevelopersRegistry = artifacts.require("DevelopersRegistry")

module.exports = (deployer, network, accounts) => {
	deployer.then(async () => {
		const WALLET_ADDRESS = accounts[0] // TODO: could be updated
		await deployer.deploy(DevelopersRegistry, WALLET_ADDRESS)
	})
}