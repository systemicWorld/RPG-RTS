// Functions the game uses that are beyond mere utility functions
class Gamey {
	createChildAgent(){
		console.log(`createChildNode()`)
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
	/*
	distributeAgents( utils, gameObjects, terrain, howMany ){
		//console.info("distributeAgents()")
		let loc
		let rSex = 1 // 1 = male
		let radius = 1
		let skinTone = ""
		let age = 0

		let agent = {}
		for( let i = 0; i < howMany; i++ ) {
			loc = utils.randomLocation( terrain )
			rSex = utils.randomLowHigh(0,1)

			radius = (utils.rollDice( 7, 5 ) * .5 * (rSex+10))/10
			skinTone = utils.randomSkinToneRGB().string
			agent = new Agent( i, loc.x, loc.y, radius, 1, skinTone )
			gameObjects.push( agent )
			
			agent.sex = rSex
			do {
				age = utils.rollDice(12,15) - 60
			}
			while (age < 0) // probability distribution is skewed into negative numbers
			agent.age = age
		}

		this.findSizeIncrease( gameObjects )
		console.info(`Mean Age: ${this.calcAverageAge(gameObjects)}`)
		this.findAgeRange(gameObjects)
	}
	*/
	distributeAgents( utils, agents, terrain, howMany ){
		//console.info("distributeAgents()")
		let loc
		let rSex = 1 // 1 = male
		let radius = 1
		let skinTone = ""
		let age = 0

		let agent = {}
		for( let i = 0; i < howMany; i++ ) {
			loc = utils.randomLocation( terrain )
			rSex = utils.randomLowHigh(0,1)

			radius = (utils.rollDice( 7, 5 ) * .5 * (rSex+10))/10
			skinTone = utils.randomSkinToneRGB().string
			agent = new Agent( i, loc.x, loc.y, radius, 1, skinTone )
			agents.push( agent )
			
			agent.sex = rSex
			do {
				age = utils.rollDice(12,15) - 60
			}
			while (age < 0) // probability distribution is skewed into negative numbers
			agent.age = age
		}

		this.findSizeIncrease( agents )
		console.info(`Mean Age: ${this.calcAverageAge(agents)}`)
		this.findAgeRange(agents)
	}
	createAgentAtLoc( utils, agents, xyObj ){
		console.info(`createAgentAtLoc()`)
		let loc
		let rSex = 1 // 1 = male
		let radius = 1
		let skinTone = ""
		let age = 0

		let agent = {}
		
		loc = xyObj
		rSex = utils.randomLowHigh(0,1)

		radius = (utils.rollDice( 7, 5 ) * .5 * (rSex+10))/10
		skinTone = utils.randomSkinToneRGB().string
		agent = new Agent( agents.length, loc.x, loc.y, radius, 10, skinTone )
		agents.push( agent )
		
		agent.sex = rSex
		do {
			age = utils.rollDice(12,15) - 60
		}
		while (age < 0) // probability distribution is skewed into negative numbers
		agent.age = age
	}
	createAgentNextToAgent( utils, agents, agent ){
		console.info(`createAgentNextToAgent()`)
		let agentID = agents.length
		let loc
		let rSex = utils.randomLowHigh(0,1) // 0 = female, 1 = male
		let radius = 1
		let speed = 1
		let skinTone = ""
		let age = 0

		let newAgent = {}
		
		radius = (utils.rollDice( 7, 5 ) * .5 * (rSex+10))/10 

		loc = {x: agent.x + agent.radius + radius, y: agent.y} // complicated reason for this function

		skinTone = utils.randomSkinToneRGB().string
		newAgent = new Agent( agentID, loc.x, loc.y, radius, speed, skinTone )
		agents.push( newAgent )
		
		newAgent.sex = rSex
		do {
			age = utils.rollDice(12,15) - 60
		}
		while (age < 0) // probability distribution is skewed into negative numbers
		newAgent.age = age
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
	getAllMales( population ){
		console.info( `getAllMales()` )
		let males = []
		let individual = population[0]
		for( let i = 0; i < population.length; i++ ){
			individual = population[i]
			if ( individual.sex == 1 ){
				males.push(individual)
			}
		}
		return males
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
}