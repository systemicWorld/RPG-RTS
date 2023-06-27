/**
 * Represents a ....
 * @class
 */
class Name {
	/**
   * Creates an instance of Rectangle.
   * @constructor
   * @param {number} a
   * @param {string} b
   * @param {number} c
   */
	constructor(a = null,
							b = null,
							color = `pink`){
		this._a = a
		this._ = 
		this._color = color
	}
	// GETTERS
	get a() { return this._a }
	get () { return this._ }
	get color() { return this._color }
	// SETTERS
	set a( a ) {
		this._a = a
	}
	set (  ) {
		this._ = 
	}
	/**
   * @param {string} rbga - like: `rgba( r, b , g , a)`
   */
	set color( rbga ){
		this._color = rbga // CSS colors, or RGB[A]() string
	}
	// METHODS
	method( arg ) {
		//console.info(`method(${arg})`)
    	// code
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
	draw( ctx, camera, viewport ){
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
}