class Agent{
	constructor( gameID, x = 0, y = 0, radius, speed, color ){
		this._id = gameID || NaN

		this._radius = radius * 10 || 1

		this._x = x  // 0 is farthest left in game world
		this._y = y  // 0 is highest up in game world
		
		/* Average human speed is 1.36 meters/second for males under 30
		1.34 for females under 30
		leg length and mass
		age, sex, size, fitness */
		this._speed = speed * 18 + (radius*2) || 1 // meters per second (10px per meter) // taller people walk faster
		this._vX = 0
		this._vY = 0
		
		this._color = color || 'yellow' // draw color
		this._secondColor = color
		this._highlight = false
		
		this._boundary = new Rectangle(x - this._radius,
																	 y - this._radius,
																	 this._radius*2,
																	 this._radius*2)
		// quadtree interaction
		this._nearby = [] // the contents of the quadTree quad this agent is in

		// narrative properties
		this._sex = 0 // zero is female
		this._mate = undefined
		this._age = 0 // years
		this._mother // an older female agent..

		// this._allegiances = []
		// this._emotion
		// this._bloodPressure
		// this._fatReserves
		// this._glycogenReserves
		// this._hydration

		// // reproductive properties
		// this._pregnant = 0 // false
		// this._gestationProgress = 0 // no progress unless pregnant
		// this._gestationPeriod = 100
		// this._gestationSpeed = 10

	}
	// Getters
	get id() { return this._id }
	get x() { return this._x }
	get y() { return this._y }
	get radius() { return this._radius }
	get speed() { return this._speed }
	get sex() { return this._sex }
	get boundary() { return this._boundary }
	get nearby() { return this._nearby }
	get highlight() { return this._highlight }
	get mate() { return this._mate }
	get age() { return this._age }
	get mother() { return this._mother }
	get pregnant() { return this._pregnant }
	// Setters
	set id( id ){ this._id = id }
	set x( x ) {
		this._x = x
		this._boundary.left = x - this._radius
	}
	set y( y ) {
		this._y = y
		this._boundary.top = y - this._radius
	}
	set radius( radius ){
		this._radius = radius
		const { x, y } = this._boundary._midpoint
		this._boundary = new Rectangle(x - radius,
																	 y - radius,
																	 radius*2,
																	 radius*2)
	}
	set speed( speed ){ this._speed = speed }
	set vX( number ){ this._vX = number }
	set vY( number ){ this._vY = number}
	set nearby ( quadContents ){ this._nearby = quadContents }
	/**
   * @param {any} string
   */
	set color( string ){
		this._color = string // CSS colors, or RGB[A]() string
	}
	set secondColor( string ){
		this._secondColor = string // CSS colors, or RGB[A]() string
	}
	/**
	 * @param {boolean} bool
	 */
	set highlight ( bool ) { this._highlight = bool }
	set sex( bool ){
		//console.info(`sex(${bool})`)
		this._sex = bool
	}
	set mate( agent ){
		this._mate = agent
	}
	set age( num ){
		this._age = num
	}
	set mother( olderFemale ){
		if( olderFemale.sex == 1 || olderFemale.age <= this._age ) return
		this._mother = olderFemale
	}
	set pregnant( bool ){
		this._pregnant = bool
	}
	// Methods
	act( player, SECONDS_PER_TICK ){
		// console.info(`act()`)
		// this.avoid(player, SECONDS_PER_TICK)
		this.move( SECONDS_PER_TICK )
	}
	move( SECONDS_PER_TICK ){
		this.x += this._vX * SECONDS_PER_TICK
		this.y += this._vY * SECONDS_PER_TICK
	}
	onCam ( camera ){
			// check if within camera bounds
			const { left, top, right, bottom } = this._boundary
			if(top > camera.bottom ||
				 right < camera.left ||
				 bottom < camera.top ||
				 left > camera.right ){
				return false
			}else{
				return true
			}
	}
	draw( dTime, ctx, camera, viewport ){
		let drawOnCam = true
			if ( this.onCam(camera) ){
			ctx.fillStyle = this._color // change to gradient below
		} else { // for debug, camera rect' will be smaller than screen bounds
			ctx.fillStyle = "rgba(200,100,200,.5)" // off camera debugger
			drawOnCam = false
		}

		const { left: viewLeft, top: viewTop } = viewport.boundary
		const aR = viewport.aspectRatio

		// Create a radial gradient
		// context.createRadialGradient(x0,y0,r0,x1,y1,r1); // TEMPLATE CODE
		//let gradient = ctx.createRadialGradient( this._x, this._y, 0, this._x, this._y, this._radius)

		let x0 = ((this._x - camera.left) / aR ) + viewLeft
		let y0 = ((this._y - camera.top) / aR ) + viewTop
		let rOutter = this._radius / aR

		let gradient = ctx.createRadialGradient( x0, y0, 0, x0, y0, rOutter )

		// Add color stops
		gradient.addColorStop(0.6, this._highlight ? `red` : this._color)
		gradient.addColorStop(1, this._highlight ? `red`: this._secondColor)
		ctx.fillStyle = gradient

		// Define a circular path
		ctx.beginPath()
		// ctx.arc(this._x, this._y, this._radius, 0 , 2 * Math.PI); // template code
		ctx.arc(x0,	y0,	rOutter, 0 , 2 * Math.PI)
		// Set the fill style and draw a circle
		ctx.fill()

		return drawOnCam
	}
	// Acts
	seek( agent, SECONDS_PER_TICK ){ // move toward gameObject
		let theta = Math.atan2( agent.y - this._y, agent.x - this._x ) // heading
		let speed = this._speed * SECONDS_PER_TICK
		this.x += Math.cos ( theta ) * speed
		this.y += Math.sin ( theta ) * speed
	}

	avoid( agent, SECONDS_PER_TICK ) { // move away from gameObject
		return
		let avoidanceDistance = 50
		let goX = agent.x
		let goY = agent.y
		let distance = Math.sqrt( (goX - this._x)**2 + (goY - this._y)**2 )
		// move away if close
		if( distance < avoidanceDistance ){
			let theta = Math.atan2( goY - this._y, goX - this._x ) // heading
			let speed = this._speed * SECONDS_PER_TICK
			this.x -= Math.cos ( theta ) * speed
			this.y -= Math.sin ( theta ) * speed
		}
	}

	checkIntersections(testSet=this._nearby){
		//console.info(`checkIntersections()`)
		if ( testSet.length == 0 ) return
		
		// console.log(`agent.id:${this.id}, nearby:${testSet.length}`)

		let r = this._radius
		let minimumDistance = r // + agent[i].radius
		let x1 = this.x
		let y1 = this.y
		let distance = 0 // Math.sqrt( (x2 - x1)**2 + (y2 - y1)**2 )
		// intersection if distance is less than minimum
		let agent = {}
		for ( let i = 0; i < testSet.length; i++ ){
			agent = testSet[i]

			if( this.id != agent.id ){
				distance = Math.sqrt( (agent.x - x1)**2 + (agent.y - y1)**2 )
				minimumDistance = r + agent.radius
				if( distance < minimumDistance ){
					// intersecting
					//console.log(`got something!`)
					agent.highlight = true
				}
			}
		}
	}

	bond( SECONDS_PER_TICK ) { // move towards mate
		//console.info(`bond()`)
		if( this._mate == undefined ) return
		let bondDistance = this._radius + this.mate.radius
		if ( this._pregnant ) bondDistance += bondDistance
		let mX = this.mate.x
		let mY = this.mate.y
		let distance = Math.sqrt( (mX - this._x)**2 + (mY - this._y)**2 )
		// move closer if not touching
		if( bondDistance >= distance ) {
			this._pregnant = true
			return
		}
		let theta = Math.atan2( mY - this._y, mX - this._x ) // heading
		let speed = this._speed * SECONDS_PER_TICK
		this.x += Math.cos ( theta ) * speed
		this.y += Math.sin ( theta ) * speed
	}

	prospectForMate ( agents ) {
		//console.info(`prospectForMate()`)
		let prospect = agents[1] // skip zero since that is the player
		let bondingDistance = 110 // how far away to look for mates
		let distance = 69420
		let pX = 0
		let pY = 0

		if ( this.sex == 1 ) { // this is a male's strategy
			for( let i = 1; i < agents.length; i++){
				prospect = agents[i]
				if ( prospect.sex ) {
					// find a female to bond with
				}
			}
		} else { // this is a female's strategy
			if ( this.age < 13 || this.age > 45 ) return
			for( let i = 1; i < agents.length; i++){
				prospect = agents[i]
				if ( prospect.sex ) {
					if ( prospect.age < 16 ) return
					// find a male to bond with
					pX = prospect.x
					pY = prospect.y
					distance = Math.sqrt( (pX - this._x)**2 + (pY - this._y)**2 )
					if ( distance <= bondingDistance ) {
						// bond what ever that means
						//console.info(`FEMALE FOUND A MATE`)
						this._mate = prospect
						break
					}
				}
			}
			//console.info(`female unable to find mate`)
		}
	}

	incubate ( SECONDS_PER_TICK, gamey ) { // if pregnant then incubation should happen
		this._gestationProgress += ( this._gestationSpeed * SECONDS_PER_TICK )
		if ( this._gestationProgress >= this._gestationPeriod ){
			this.birth()
		}
	}
	birth (  ) { // a new agent must be created near the birthor
		console.log(`birth()`)

		this._pregnant = false
	}
	print(){
		console.info(`Agent..left:${this.left}, top:${this.top}, right:${this.right}`)
	}
}