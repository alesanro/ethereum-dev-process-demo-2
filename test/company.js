const DevelopersRegistry = artifacts.require("DevelopersRegistry")
const Company = artifacts.require("Company")

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
	let registry

	before(async () => {
		registry = await DevelopersRegistry.new(wallet, { from: systemOwner, })
		await registry.improveSkill(developers.dev1.skills[0].name, { from: developers.dev1.address, value: web3.toWei(0.1, "ether") })
		await registry.improveSkill(developers.dev1.skills[1].name, { from: developers.dev1.address, value: web3.toWei(0.03, "ether") })
		await registry.improveSkill(developers.dev2.skills[0].name, { from: developers.dev2.address, value: web3.toWei(0.05, "ether") })
	})

	context("creation", () => {

		it("should THROW and not be able to create a company without developers' registry", async () => {
			try {
				await Company.new(0x0, [], { from: systemOwner, })
			} 
			catch (e) {
				ensureException(e)
			}
		})

		it("should be able to create a company with real registry", async () => {
			const company = await Company.new(registry.address, [], { from: systemOwner, })
			assert.isDefined(company)
		})

		let company

		it("should be able to create a company with developers", async () => {
			company = await Company.new(
				registry.address, 
				[
					developers.dev1.address, 
					developers.dev2.address,
					developers.dev2.address,
					developers.dev1.address, 
					developers.dev1.address, 
				],
				{ from: systemOwner, }
			)
		})

		it("should not contain duplicate developers", async () => {
			assert.equal((await company.developersCount.call()).toNumber(), 2)
		})
	})

	context("hiring/firing", () => {
		let company
		const nonCEO = accounts[8]
		
		before(async () => {
			company = await Company.new(
				registry.address, 
				[
					developers.dev1.address, 
					developers.dev2.address,
				],
				{ from: systemOwner, }
			)
		})

		it("should not be able to fire a developer by non-CEO with false result", async () => {
			assert.isFalse((await company.fireDeveloper.call(developers.dev1.address, { from: nonCEO, })))
		})

		it("developer should still work in a company", async () => {
			await company.fireDeveloper(developers.dev1.address, { from: nonCEO, })
			assert.isTrue(await company.isDeveloperInTeam.call(developers.dev1.address))
		})

		it("should not be possible to hire hired developer", async () => {
			assert.isFalse((await company.hireDeveloper.call(developers.dev1.address, { from: systemOwner, })))
		})

		it("should be able to fire a developer by CEO with true result", async () => {
			assert.isTrue((await company.fireDeveloper.call(developers.dev1.address, { from: systemOwner, })))
		})

		it("should be able to fire a developer by CEO with true result", async () => {
			await company.fireDeveloper(developers.dev1.address, { from: systemOwner, })
			assert.isFalse(await company.isDeveloperInTeam.call(developers.dev1.address))
		})

		it("should not be possible to fire fired developer", async () => {
			assert.isFalse((await company.fireDeveloper.call(developers.dev1.address, { from: systemOwner, })))
		})

		it("should not be possible to hire not working developer by nonCEO with false result", async () => {
			assert.isFalse((await company.hireDeveloper.call(developers.dev1.address, { from: nonCEO, })))
		})

		it("should not be possible to hire not working developer by nonCEO", async () => {
			await company.hireDeveloper(developers.dev1.address, { from: nonCEO, })
			assert.isFalse(await company.isDeveloperInTeam.call(developers.dev1.address))
		})

		it("should be possible to hire not working developer by CEO with true result", async () => {
			assert.isTrue((await company.hireDeveloper.call(developers.dev1.address, { from: systemOwner, })))
		})

		it("should be possible to hire not working developer by CEO", async () => {
			await company.hireDeveloper(developers.dev1.address, { from: systemOwner, })
			assert.isTrue(await company.isDeveloperInTeam.call(developers.dev1.address))
		})
	})

	context("transfer CEO rights", () => {
		let company
		const futureCEO = accounts[8]
		
		before(async () => {
			company = await Company.new(
				registry.address, 
				[
					developers.dev1.address, 
					developers.dev2.address,
				],
				{ from: systemOwner, }
			)
		})

		it("should show real CEO", async () => {
			assert.equal(await company.ceo.call(), systemOwner)
		})

		it("should not be able to fire a developer by non-CEO with false result", async () => {
			assert.isFalse((await company.fireDeveloper.call(developers.dev1.address, { from: futureCEO, })))
		})

		it("nonCEO should not be able to transfer CEO rights", async () => {
			await company.transferCEOChair(futureCEO, { from: futureCEO, })
			assert.equal(await company.ceo.call(), systemOwner)
		})

		it("CEO should be able to initiate rights transfer", async () => {
			await company.transferCEOChair(futureCEO, { from: systemOwner, })
			assert.equal(await company.ceo.call(), futureCEO)
		})

		it("should not be able to fire a developer by non-CEO with false result", async () => {
			assert.isFalse((await company.fireDeveloper.call(developers.dev1.address, { from: systemOwner, })))
		})
	})
})