class Agent{
	constructor( gameID, x, y, radius, speed, color ){
		this._id = gameID || NaN

		this._radius = radius || 1

		this._x = x || 0 // 0 is farthest left in game world
		this._y = y || 0 // 0 is highest up in game world
		
		/* Sound barrier at sea level: 343 meters/second 
        barrel length, bullet weight, powder weight*/
		this._speed = speed || 331 // meters per second (10px per meter)
		this._color = color || 'red' // paint color
		this._secondColor = color

		// Bounding Box
		this._left = this._x - this._radius
		this._top = this._y - this._radius
		this._right = this._x + this._radius
		this._bottom = this._y + this._radius

		// narrative properties
        this._manufacturer
        this._cartridgeMass
        this._bulletMass

	}
	// Getters
	get id() { return this._id }
	get x() { return this._x }
	get y() { return this._y }
	get radius() { return this._radius }
	get speed() { return this._speed }
	get sex() { return this._sex }
	get left() { return this._left }
	get top() { return this._top }
	get right() { return this._right }
	get bottom() { return this._bottom }
	get age() { return this._age }
	// Setters
	set id( id ){
		this._id = id
	}
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
	set speed( speed ){
		this._speed = speed
	}
	/**
   * @param {any} string
   */
	set color( string ){
		this._color = string // CSS colors, or RGB[A]() string
	}
	set secondColor( string ){
		this._secondColor = string // CSS colors, or RGB[A]() string
	}
	set age( num ){
		this._age = num
	}
	// Methods
	act( player, dTime ){
		// console.info(`act()`)

		this.avoid(player, dTime)
	}
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
    if ( this.onCam(camera) ){
      ctx.fillStyle = this._color // change to gradient below
    }else{ // for debug, camera rect' will be smaller than screen bounds
      ctx.fillStyle = "rgba(200,100,200,.5)" // off camera debugger
      drawOnCam = false
    }
    // Create a radial gradient
	// context.createRadialGradient(x0,y0,r0,x1,y1,r1); // TEMPLATE CODE
    //let gradient = ctx.createRadialGradient( this._x, this._y, 0, this._x, this._y, this._radius)

	let x0 = ((this._x - camera.left) / viewport.aspectRatio) + viewport.left
	let y0 = ((this._y - camera.top) / viewport.aspectRatio) + viewport.top
	let rOutter = this._radius * 10 / viewport.aspectRatio

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
}