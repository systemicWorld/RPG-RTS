class Camera{
	/**
	 * Creates an instance of Camera.
	 * @param {Object} boundary
	 */
	constructor( boundary ) {
		if (!boundary) throw TypeError('boundary is a mandatory param')
		if (!(boundary instanceof Rectangle)) throw TypeError('boundary should be a Rectangle')
		this._boundary = boundary
	}
	// Getters
	get boundary() { return this._boundary }
	// Setters
	set boundary( boundary ){ 
		if (!boundary) throw TypeError('boundary is a mandatory param')
		if (!(boundary instanceof Rectangle)) throw TypeError('boundary should be a Rectangle')
		this._boundary = boundary
	}
	// Methods
	move( dTime ){
		this.x += this._vX * dTime
		this.y += this._vY * dTime
	}
	/**
   * Moves the camera slowly if short move, and fast if far move.
   * @constructor
   * @param {number} targetX
   * @param {number} targetY
   */
	nearEdgeAsymptotic( tX, tY ) {
		const { left, top, width, height, right, bottom } = this._boundary
		
		let boxPortion = 0.4
		let nearEdges = new Rectangle(left + width * boxPortion,
																	top + height * boxPortion,
																	null, null,
																	right - width * boxPortion,
																	bottom - height * boxPortion)
		if( nearEdges.contains( {tX, tY} ) ) return														
		
		let distanceBeyond = 0
		let smoothingFactor = .94
		if( tX < nearEdges.left ){
			distanceBeyond = nearEdges.left - tX
			this.boundary.left -= distanceBeyond * (1 - smoothingFactor)
		}else if( tX > nearEdges.right ){
			distanceBeyond = tX - nearEdges.right
			this.boundary.right += distanceBeyond * (1 - smoothingFactor)
		}

		if( tY < nearEdges.top ){
			this.boundary.top = (smoothingFactor * top) + ((1-smoothingFactor) * (tY - height * boxPortion)) // SMOOTH
		}else if( tY > nearEdges.bottom ){
			this.boundary.bottom = (smoothingFactor * bottom) + ((1-smoothingFactor) * (tY + height * boxPortion))
		}

		// if( tX < nearEdges.left ){
		// 	this.boundary.left = ((smoothingFactor * left)) + ((1-smoothingFactor) * (tX - width * boxPortion)) // SMOOTH
		// }else if( tX > nearEdges.right ){
		// 	this.boundary.right = (smoothingFactor * right) + ((1-smoothingFactor) * (tX + width * boxPortion))
		// }

		// if( tY < nearEdges.top ){
		// 	this.boundary.top = (smoothingFactor * top) + ((1-smoothingFactor) * (tY - height * boxPortion)) // SMOOTH
		// }else if( tY > nearEdges.bottom ){
		// 	this.boundary.bottom = (smoothingFactor * bottom) + ((1-smoothingFactor) * (tY + height * boxPortion))
		// }

	}

	center( x, y, rightBound, bottomBound ) {
		const { left, top, width, height } = this._boundary
		this._boundary.left = x - width / 2
		this._boundary.top = y - height / 2
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