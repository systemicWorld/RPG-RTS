/**
 * Represents a words and phrases drawn onto the world.
 * @class
 */
class Stamp{
	/**
   * Creates an instance of stamp.
   * @constructor
   * @param {string} text
   * @param {Object} boundary
   * @param {string} color - like: `rgb( r, b , g )`
	 * @param {number} duration - time before the text fades?
   */
	constructor(text = null,
							boundary = null,
              color = `pink`,
							duration = 0){
		this._text = text
		this._boundary = boundary
    this._color = color
		this._duration = duration

		this._fade = 0.8 // will fade out after duration

    this._fontsize = `40`+`px`
    this._font = `${this._fontsize} Arial`
    this._shadowColor = `rgba(220,220,220,${this._fade})`
    this._shadowBlur = 5
    this._shadowOffsetX = 2
    this._shadowOffsetY = 2
    this._rotate = 45 * 0.017453292519943295 // 0.017453292519943295 radians in 1 degree
	}
	// GETTERS
	get text() { return this._text }
	get boundary() { return this._boundary }
  get color() { return this._color }
	get face() { return this._fade }
	get duration() { return this._duration }
	// SETTERS
	set text( text ) {
		this._text = text
	}
	set boundary( rectangle ) {
		this._boundary = rectangle
	}
	/**
   * @param {string} rbga - like: `rgba( r, b , g , a)`
   */
	set color( rbga ){
		this._color = rbga // CSS colors, or RGB[A]() string
	}
	/**
	 * @param {string|number} opacity
	 */
	set fade( opacity ){
		this._fade = opacity
		// Find the index of the last comma
		const symbolIndex = this._color.lastIndexOf(',');
		// Remove characters from the end of the string until the symbol then add new string
		this.color = this._color.slice(0, symbolIndex + 1) + `${this._fade})`
	}
  set fontsize( integer ){
    this._fontsize = `${integer}px`
    this._font = `${this._fontsize} Arial`
  }
	// METHODS
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
		if(this._duration < 0){
			return
		}
		this._duration -= dTime

		let drawOnCam = true
			if ( this.onCam(camera) ){
			ctx.fillStyle = this._color // change to gradient below
		} else { // for debug, camera rect' will be smaller than screen bounds
			ctx.fillStyle = "rgba(200,100,200,.5)" // off camera debugger
			drawOnCam = false
		}

    ctx.save()
    // Set the font properties
    ctx.font = this._font
    ctx.fillStyle = this._color

    // Set the shadow properties
    ctx.shadowColor = this._shadowColor
    ctx.shadowBlur = this._shadowBlur
    ctx.shadowOffsetX = this._shadowOffsetX
    ctx.shadowOffsetY = this._shadowOffsetY

    // Translate to the desired position
    let x0 = ((this._boundary.left - camera.left) )// + viewLeft
    let y0 = ((this._boundary.top - camera.top) ) //+ viewTop
    ctx.translate(x0, y0);

    // Rotate the canvas
    ctx.rotate(this._rotate) // Rotate is in radians

    // Draw the text on the canvas
    ctx.fillText(this._text, 0, 0);

    // Restore the canvas state
    ctx.restore();

		return drawOnCam
	}
}