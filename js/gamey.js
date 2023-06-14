// Functions the game uses that are beyond mere utility functions
class Gamey {
	createChildAgent(){
		console.log(`createChildNode()`)
	}
	createHuman( utils ) { 
		console.info(`createHuman()`)
		let sex = utils.binary() // 1 = male
		let radius = 1
		let skinTone = ""
		let age = 0

		let human = {}

		if (sex==1){//male
			radius = utils.gaussianRandom(1.778, 0.0762) // male 70 inch mean and 3 inch stdDev
		}else{//female
			radius = utils.gaussianRandom(1.618, 0.0559)// 1.618 meters
		}

		skinTone = utils.randomSkinToneRGB().string
		
		human = new Agent( NaN, 0, 0, radius, 1, skinTone )
		human.sex = sex
		human.age = age

		return human
	}
	createHumanAgent( objectID ){
		console.log(`createHumanAgent()`)

		let sex = 0
		let radius = 1
		let skinTone = ""
		let age = 0

		let agent = {}

		sex = utils.randomLowHigh(0,1)

		radius = (utils.rollDice( 7, 5 ) * .5 * (sex+10))/10
		skinTone = utils.randomSkinToneRGB().string
		agent = new Agent( objectID, -1, -1, radius, 1, skinTone )
		gameObjects.push( agent )
		
		agent.sex = sex
		do {
			age = utils.rollDice(12,15) - 60
		}
		while (age < 0) // probability distribution is skewed into negative numbers
		agent.age = age
	}

	distributeAgents( utils, agents, terrain, howMany ){
		console.info("distributeAgents()")
		let loc
		let agent = this.createHuman(utils) // meh :/
		for(let i=0;i<howMany;i++){
			agent = this.createHuman(utils)
			agent.id = agents.length
			agents.push(agent)

			agent.age=30
			loc = utils.randomXY( terrain )
			agent.x=loc.x
			agent.y=loc.y
		}
		let males = this.getAllMales(agents)
		let malesRadaii = []
		males.forEach(male => malesRadaii.push(male.radius))
		utils.descriptiveStatistics(malesRadaii)
	}

	createAgentAtLoc( utils, agents, coords ){
		console.info(`createAgentAtLoc(gameID??)`)
		let agent = this.createHuman(utils)
		agent.x = coords.x
		agent.y = coords.y
		agents.push( agent )
	}

	createAgentNextToAgent( utils, agents, agent ){
		console.info(`createAgentNextToAgent( utils{}, agents[], agent:${agent} )`)
		let agentID = agents.length
		let loc
		
		let human = this.createHuman(utils)
		
		loc = {x: agent.x + agent.radius + human.radius, y: agent.y} // complicated reason for this function

		human.id=agentID
		human.x=loc.x
		human.y=loc.y
		agents.push( human )
	}

	colorAgentsBySex( agents ){
		console.info("colorAgentsBySex()")
		let agent = {}
		for ( let i = 0; i < agents.length; i++ ){
			agent = agents[i]
			if ( agent.sex ) {
				agent.color = `rgba(108,160,220,1)`
			} else {
				agent.color = `rgba(248,185,212,1)`
			}
		}
	}
	colorAgentsByAge( agents ){
		console.info(`colorAgentsByAge()`)
		let age = 0
		for ( let i = 0; i < agents.length; i++){
			age = agents[i].age / 100
			agents[i].secondColor = `rgba(${255-(255*age)},${255-(255*age)},${255-(255*age)},1)`
		}
	}
	findAgeRange(agents){
		console.log(`findAgeRange()`)
		// find oldest and youngest
		let oldest = 0
		let youngest = 100
		for( let i = 0; i < agents.length; i++ ){
			let age = agents[i].age
			if( age > oldest ) oldest = age
			if( age < youngest ) youngest = age
		}
		console.info( `Youngest: ${youngest}, Oldest: ${oldest}` )
	}
	mateBehavior( agents ){
		console.log(`mateBehavior()`)

		for( let i = 1; i < agents.length; i++) {
			agents[i].prospectForMate( agents )
		}
	}
	getAllFemales( population ){
		console.info( `getAllFemales()` )
		let females = []
		let individual = population[0]
		for( let i = 0; i < population.length; i++ ){
			individual = population[i]
			if ( individual.sex == 0 ){
				females.push(individual)
			}
		}
		return females
	}
	getAllMales( population )  {
		console.info( `getAllMales(population)` )
		let males = []
		let individual = population[0]
		for( let i = 0; i < population.length; i++ ){
			individual = population[i]
			if ( individual.sex == 1 ){
				males.push(individual)
			}
		}
		return males
		/*
const array1 = ['a', 'b', 'c'];

array1.forEach(element => console.log(element));

// Expected output: "a"
// Expected output: "b"
// Expected output: "c"
		let males = population.forEach(human => (human.sex == 1) ? males.push(human)} )
		return males
		*/
	}
	calcAverageRadius( circles ) {
		console.info( `calcAverageRadius()` )
		let sum = 0
		for(let i = 0; i < circles.length; i++ ) {
			sum += circles[i].radius
		}
		let mean = sum / circles.length
		return mean
	}
	calcAverageAge( population ) {
		console.info(`calcAverageAge()`)
		let sum = 0
		for( let i = 0; i < population.length; i++ ) {
			sum += population[i].age
		}
		let mean = sum / population.length
		return mean
	}
	findSizeIncrease( agents ) {
		// Find average radius of males and females
		let femaleMean = this.calcAverageRadius( this.getAllFemales(agents) )
		console.info(`females mean radius: ${femaleMean}`)
		let maleMean = this.calcAverageRadius( this.getAllMales(agents) )
		console.info(`males mean radius: ${maleMean}`)
		let percentIncrease = [(maleMean - femaleMean)/femaleMean] * 100
		console.info(`incease: ${percentIncrease}`)// 
	}
	fireProjectile ( bullets ) {
		console.info(`fireProjectile()`)
		let bullet = new Projectile(0,0)

		bullets.push( bullet )

		// need a direction
	}
}