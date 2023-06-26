class Projectile{
	constructor( x, y ){
		this._radius = 10

		this._x = x || 0 // 0 is farthest left in game world
		this._y = y || 0 // 0 is highest up in game world
		
		/* Sound barrier at sea level: 343 meters/second 
        barrel length, bullet weight, powder weight*/
		this._speed = 1 // meters per second (10px per meter)
		this._color = 'red' // paint color
		this._secondColor = `blue`

		this._vector = 0

		this._vX = 0
		this._vY = 0

		// Bounding Box
		this._left = this._x - this._radius
		this._top = this._y - this._radius
		this._right = this._x + this._radius
		this._bottom = this._y + this._radius

		// narrative properties
        this._manufacturer
        this._cartridgeMass
        this._bulletMass
		
		// Impact ..
		this._impact = false
	}
	// Getters
	get x() { return this._x }
	get y() { return this._y }
	get radius() { return this._radius }
	get speed() { return this._speed }
	get left() { return this._left }
	get top() { return this._top }
	get right() { return this._right }
	get bottom() { return this._bottom }
	get impact() { return this._impact }
	// Setters
	set x( x ) {
		this._x = x
		this._left = x - this._radius
		this._right = x - this._radius
	}
	set y( y ) {
		this._y = y
		this._top = y - this._radius
		this._bottom = y + this._radius
	}
	set radius( radius ){
		this._radius = radius
		this._left = this._x - radius
		this._top = this._y - radius
		this._right = this._x + radius
		this._bottom = this._y + radius
	}
	set speed( speed ){ this._speed = speed }
	/**
   * @param {any} string
   */
	set color( string ){
		this._color = string // CSS colors, or RGB[A]() string
	}
	set secondColor( string ){
		this._secondColor = string // CSS colors, or RGB[A]() string
	}
	set impact( bool ){
		this._impact = bool
	}
	// Methods
	onCam ( camera ){
			// check if within camera bounds
			if( this._top > camera.bottom ||
				this._right < camera.left ||
				this._bottom < camera.top ||
				this._left > camera.right ){
				return false
			}else{
				return true
			}
	}
	draw( ctx, camera, viewport ){
		let drawOnCam = true
		if( this.onCam(camera) ){
			ctx.fillStyle = this._color // change to gradient below
		}else{ // for debug, camera rect' will be smaller than screen bounds
			ctx.fillStyle = "rgba(200,100,200,.5)" // off camera debugger
			drawOnCam = false
		}

		const { left: viewLeft, top: viewTop } = viewport.boundary
		const aR = viewport.aspectRatio

		// Create a radial gradient
		// context.createRadialGradient(x0,y0,r0,x1,y1,r1); // TEMPLATE CODE
		//let gradient = ctx.createRadialGradient( this._x, this._y, 0, this._x, this._y, this._radius)
		let x0 = ((this._x - camera.left) / aR) + viewLeft
		let y0 = ((this._y - camera.top) / aR) + viewTop
		let rOutter = this._radius / aR

		let gradient = ctx.createRadialGradient( x0, y0, 0, x0, y0, rOutter )

		// Add color stops
		gradient.addColorStop(0.6, this._color)
		gradient.addColorStop(1, this._secondColor)
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
	move( dTime ){
		// this._x += .1*dTime * this.speed
		// this._y += dTime * this._vector
		// Calculate the final velocity components
		this._x += this._vX// * dTime
		this._y += this._vY //* dTime
	}
	fire( dX, dY ){
		console.log(``)
		// Calculate the direction from current position to the destination
		const directionX = dX - this._x;
		const directionY = dY - this._y;

		// Calculate the magnitude of the direction vector
		const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);

		// Calculate the normalized direction vector
		const normalizedDirectionX = directionX / magnitude;
		const normalizedDirectionY = directionY / magnitude;

		// Calculate the final velocity components
		this._vX = normalizedDirectionX * this._speed;
		this._vY = normalizedDirectionY * this._speed;
	}
	checkIntersections( testSet=this._nearby ){
		//console.info(`checkIntersections()`)
		if ( testSet.length == 0 ) return
		
		console.log(`bullet, nearby:${testSet.length}`)

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
					agent.highlight = true
					this.impact = true
					return
				}
			}
		}
	}
}
