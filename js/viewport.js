class Viewport {
	constructor( left, top, width, height ) {
		this._left = left
		this._top = top
		this._width = width
		this._height = height
		// Bounds
		this._right = this._left + this._width
		this._bottom = this._top + this._height
		//
		this._aspectRatio = 1 // viewport size is multipled by AR to get camera size
	}
	// Getters
	get left() { return this._left }
	get top() { return this._top }
	get width() { return this._width }
	get height() { return this._height }
	get right() { return this._right }
	get bottom() { return this._bottom }
	get aspectRatio() { return this._aspectRatio }
	// Setters
	set left( left ) { // Move right in relation
		this._left = left
		this._right = left + this._width
	}
	set width( width ) { // Adjust right bound
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
	set height( height ) { // Adjust bottom bound
		this._height = height
		this._bottom = this._top + this._height
	}
	set bottom( bottom ) { // Move top in relation
		this._bottom = bottom
		this._top = bottom - this._height
	}
	set aspectRatio( aspectRatio ) { this._aspectRatio = aspectRatio }
	// Methods
	draw( ctx ) {
		ctx.beginPath();
		ctx.lineWidth = 2
		ctx.strokeStyle = "yellow"
		ctx.rect( this._left, this._top, this._width, this._height );
		ctx.stroke();
	}
}