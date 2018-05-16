const DevelopersRegistry = artifacts.require("DevelopersRegistry")

function isException(error) {
    let strError = error.toString();
    return strError.includes('invalid opcode') || strError.includes('invalid JUMP') || strError.includes('revert') ;
}

function ensureException(error) {
    assert(isException(error), error.toString());
}

contract("Developers Registry", (accounts) => {

	const systemOwner = accounts[0]
	const wallet = accounts[1]
	const developers = {
		dev1: {
			address: accounts[2],
			skills: [
				{
					name: "blockchain"
				}, 
				{
					name: "js"
				}
			]
		},
		dev2: {
			address: accounts[3],
			skills: [
				{
					name: "js"
				}
			]
		}
	}

	context("creation", () => {
		
		it("should THROW and not be able to create without wallet", async () => {
			try {
				await DevelopersRegistry.new(0x0, { from: systemOwner, })
				assert(false, "Should not get here")
			}
			catch (e) {
				ensureException(e)
			}
		})

		it("should create valid wallet", async () => {
			const registry = await DevelopersRegistry.new(wallet, { from: systemOwner, })
			assert.isDefined(registry)
		})
	})

	context("skills", () => {
		let registry

		before(async () => {
			registry = await DevelopersRegistry.new(wallet, { from: systemOwner, })
		})

		it("should not allow to increase skill without sending ether", async () => {
			const developer = developers.dev1
			try {
				await registry.improveSkill(developer.skills[0].name, { from: developer.address, value: 0 })
			}
			catch (e) {
				ensureException(e)
			}
		})

		const dev1Skill1Value = web3.toBigNumber(web3.toWei(0.0001, "ether"))

		it("should allow to increase skill with sending ether", async () => {
			const developer = developers.dev1
			await registry.improveSkill(developer.skills[0].name, { from: developer.address, value: dev1Skill1Value })

			const [balance,] = await registry.skillDetails.call(developer.address, developer.skills[0].name)
			assert.equal(balance.toString(), dev1Skill1Value.toString())
		})

		const dev1Skill2Value = web3.toBigNumber(web3.toWei(0.01, "ether"))

		it("should allow to more increase skill with sending ether and append it", async () => {
			const developer = developers.dev1
			await registry.improveSkill(developer.skills[0].name, { from: developer.address, value: dev1Skill2Value })

			const [balance,] = await registry.skillDetails.call(developer.address, developer.skills[0].name)
			assert.equal(balance.toString(), dev1Skill1Value.plus(dev1Skill2Value).toString())
		})

		const dev2Skill1Value = web3.toBigNumber(web3.toWei(0.1, "ether"))

		it("should allow to update another developer with some skills", async () => {
			const developer = developers.dev2
			await registry.improveSkill(developer.skills[0].name, { from: developer.address, value: dev2Skill1Value })

			const [balance,] = await registry.skillDetails.call(developer.address, developer.skills[0].name)
			assert.equal(balance.toString(), dev2Skill1Value.toString())
		})
	})
})