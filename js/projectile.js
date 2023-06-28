/**
 * A projectile like a bullet
 * @class 
 */
class Projectile{
	constructor(x = 0,
							y = 0,
							radius = 1 ){
		this._x = x // 0 is farthest left in game world
		this._y = y // 0 is highest up in game world
		this._radius = radius

		this._boundary = new Rectangle(x - radius,
																	 y - radius,
																	 this._radius*2,
																	 this._radius*2)

		/* Sound barrier at sea level: 343 meters/second 
        barrel length, bullet weight, powder weight*/
		this._speed = 143 // meters per second (10px per meter)
		this._color = 'red' // paint color
		this._secondColor = `blue`

		this._vX = 0
		this._vY = 0

		// narrative properties
		this._manufacturer
		this._cartridgeMass
		this._bulletMass
		
		// Impact ..
		this._impact = false

		// Activated?
		this._active = false
	}
	// Getters
	get x() { return this._x }
	get y() { return this._y }
	get radius() { return this._radius }
	get speed() { return this._speed }
	get vX(){ return this._vX }
	get vY(){ return this._vY }
	get boundary() { return this._boundary }
	get impact() { return this._impact }
	// Setters
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
	set speed( number ){ this._speed = number }
	set vX( number ){ this._vX = number }
	set vY( number ){ this._vY = number }
	/**
   * @param {string} rbga - like: `rgba( r, b , g , a)`
   */
	set color( rbga ){
		this._color = rbga // CSS colors, or RGB[A]() string
	}
	/**
   * @param {string} rbga - like: `rgba( r, b , g , a)`
   */
	set secondColor( rbga ){
		this._secondColor = rbga // CSS colors, or RGB[A]() string
	}
	set impact( bool ){
		this._impact = bool
	}
	// Methods
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
		if( this.onCam(camera) ){
			ctx.fillStyle = this._color // change to gradient below
		}else{ // for debug, camera rect' will be smaller than screen bounds
			ctx.fillStyle = `rgba(200,100,200,.5)` // off camera debugger
			drawOnCam = false
		}

		const { left: viewLeft, top: viewTop } = viewport.boundary
		const aR = viewport.aspectRatio

		// Create a radial gradient
		// context.createRadialGradient(x0,y0,r0,x1,y1,r1); // TEMPLATE CODE
		let x0 = (this._x + ((this._vX * dTime) - camera.left) / aR ) + viewLeft
		let y0 = (this._y + ((this._vY * dTime) - camera.top) / aR ) + viewTop
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

	move( SECONDS_PER_TICK ){
		this.x += this._vX * SECONDS_PER_TICK
		this.y += this._vY * SECONDS_PER_TICK
	}
	fire( dX, dY ){
		// console.log(`fire()`)
		// Calculate the direction from current position to the destination
		const directionX = dX - this._x;
		const directionY = dY - this._y;

		// Calculate the magnitude of the direction vector
		const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);

		// Calculate the normalized direction vector
		const normalizedDirectionX = directionX / magnitude;
		const normalizedDirectionY = directionY / magnitude;

		// Calculate the final velocity components
		this.vX = normalizedDirectionX * this._speed;
		this.vY = normalizedDirectionY * this._speed;

		this._active = true
	}
	checkIntersections( testSet=this._nearby ){
		//console.info(`checkIntersections()`)
		if ( testSet.length == 0 ) return
		
		// console.log(`bullet, nearby:${testSet.length}`)

		let r = this._radius
		let minDistance = r // + agent[i].radius
		let x1 = this._x
		let y1 = this._y
		let distance = 0 // distance formula Math.sqrt( (x2 - x1)**2 + (y2 - y1)**2 )
		// intersection if distance is less than minimum
		let agent = {}
		for ( let i = 0; i < testSet.length; i++ ){
			agent = testSet[i]

			distance = Math.sqrt( (agent.x - x1)**2 + (agent.y - y1)**2 )
			minDistance = r + agent.radius
			if( distance < minDistance ){	
				agent.highlight = true
				this.impact = true
				this._active = false
			}
		}
	}
}
