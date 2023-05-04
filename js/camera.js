class Camera{
	constructor( left, top, width, height ){
		this._left = left
		this._width = width
		this._right = left + width
		this._top = top
		this._height = height
		this._bottom = top + height
	}
	// Getters
	get left() { return this._left }
	get width() { return this._width }
	get right() { return this._right }
	get top() { return this._top }
	get height() { return this._height }
	get bottom() { return this._bottom }
	// Setters
	set left( left ) {
		this._left = left
		this._right = left + this._width
	}
	set width( width ) { 
		this._width = width
		this._right = this._left + this._width
	}
	set right( right ) { 
		this._right = right
		this._left = right - this._width
	 }
	set top( top ) {
		this._top = top
		this._bottom = top + this._height
	}
	set height( height ) {
		this._height = height
		this._bottom = this._top + this._height
	}
	set bottom( bottom ) {
		this._bottom = bottom
		this._top = bottom - this._height
	}
	// Methods
	nearEdgeAsymptotic( x, y, rightBound, bottomBound ) {
		// want to have like a box in the center of viewport
		// allow player to move within that box before moving camera at all
		//document.title = Math.floor(this._left + this._width * .3) + " | " + Math.floor(x) + " | " + Math.floor(this._right - this._width*.3)
		//
		let windowRatio = 0.4

		if( x > this._left + this._width * windowRatio && 
			x < this._right - this._width * windowRatio &&
			y > this._top + this._height * windowRatio &&
			y < this._bottom - this._height * windowRatio ) {
			return true
		}else{
			// return false // do some averaging below
		}
		// Above is single point check within free window
		// Below averages based on which bound was passed
		if ( x < this._left + this._width * windowRatio ) {
			this.left = (.9 * this._left) + (.1 * (x - this._width * windowRatio)) // SMOOTH
		}else if ( x > this._right - this._width * windowRatio ) {
			this.right = (.9 * this._right) + (.1 * (x + this._width * windowRatio)) 
		}

		if ( y < this._top + this._height * windowRatio ) {
			this.top = (.8 * this.top) + (.2 * (y - this._height * windowRatio)) // SMOOTH
		}else if ( y > this._bottom - this._height * windowRatio ) {
			this.bottom = (.8 * this._bottom) + (.2 * (y + this._height * windowRatio))
		}
	}
	center( x, y, rightBound, bottomBound ) {
		this.left = x - this._width / 2
		this.top = y - this._height / 2
		this.bound( rightBound, bottomBound )
	}
	asymptoticAveraging( x, y, rightBound, bottomBound ) {
		// x += (target-x)*.1
		// x = (.9*x) + (.1*target)
		this.left = (.9 * this._left) + (.1 * (x - this._width / 2))
		this.top = (.8 * this.top) + (.2 * (y - this._height / 2))
		this.bound( rightBound, bottomBound )
	}
	bound( right, bottom ) {
		if ( this._left < 0 ) {
			this.left = 0
		} else if( this._right > right ) {
			this.right = right
		}
		if ( this._top < 0 ) {
			this.top = 0
		} else if( this._bottom > bottom ) {
			this.bottom = bottom
		}
	}
	draw( ctx ) {
		ctx.beginPath();
		ctx.lineWidth = 1
		ctx.strokeStyle = "cyan"
		ctx.rect( this._left, this._top, this._width, this._height );
		ctx.stroke();
	}
}