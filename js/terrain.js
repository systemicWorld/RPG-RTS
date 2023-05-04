class Terrain {
	constructor( width, height ) {
		this._width = width
		this._height = height
	}
	// Getters
	get width () { return this._width }
	get height () { return this._height }
	// Setters
	set width ( width ) { this._width = width }
	set height ( height ) { this._height = height }
	// Methods
	draw( ctx, camera, viewport ){
		// Create a radial gradient
		var gradient = ctx.createRadialGradient(
			this._width / 2 - camera.left,
			this._height / 2 - camera.top,
			0,
			this._width / 2 - camera.left,
			this._height / 2 - camera.top,
			this._width / 2 ); // context.createRadialGradient(x0,y0,r0,x1,y1,r1);

		// Add three color stops
		gradient.addColorStop(0, 'rgb(31,63,0)')
		gradient.addColorStop(.5, 'rgb(135,91,54)')
		gradient.addColorStop(1, 'rgb(31,63,0)')

		ctx.fillStyle = gradient

		ctx.fillRect(
			0 - camera.left,
			0 - camera.top,
			this._width,
			this._height)
		
		ctx.beginPath();
		ctx.lineWidth = 3/ viewport.aspectRatio
		ctx.strokeStyle = "teal"
		ctx.rect(
			(-camera.left / viewport.aspectRatio) + viewport.left,
			(-camera.top / viewport.aspectRatio) + viewport.top, 
			this._width / viewport.aspectRatio,
			this._height / viewport.aspectRatio );
		ctx.stroke();
	}
}