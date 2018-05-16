const DevelopersRegistry = artifacts.require("DevelopersRegistry")
const Company = artifacts.require("Company")

module.exports = deployer => {
	deployer.then(async () => {
		const DEVELOPERS = [] // TODO: init here of 'hire' them by function call
		await deployer.deploy(Company, DevelopersRegistry.address, DEVELOPERS)
	})
}