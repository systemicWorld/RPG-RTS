/**
 * Represents a window through which the game can be played.
 * @class
 */
class Viewport {
	/**
	 * Creates an instance of Viewport.
	 * @param {Object} boundary
	 */
	constructor( boundary ) {
		if (!boundary) throw TypeError('boundary is a mandatory param')
		if (!(boundary instanceof Rectangle)) throw TypeError('boundary should be a Rectangle')
		this._boundary = boundary

		//
		this._aspectRatio = 1 // viewport size is multipled by AR to get camera size
	}
	// Getters
	get boundary() { return this._boundary }
	get aspectRatio() { return this._aspectRatio }
	// Setters
	set boundary( boundary ){ 
		if (!boundary) throw TypeError('boundary is a mandatory param')
		if (!(boundary instanceof Rectangle)) throw TypeError('boundary should be a Rectangle')
		this._boundary = boundary
	}
	set aspectRatio( aspectRatio ){ this._aspectRatio = aspectRatio }
	// Methods
	draw( ctx ) {
		ctx.beginPath()
		ctx.lineWidth = 2
		ctx.strokeStyle = "yellow"
		const { left, top, width, height } = this._boundary
		ctx.rect( left, top, width, height )
		ctx.stroke()
	}
}