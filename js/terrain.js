class Terrain {
	constructor( boundary ) {
		if (!boundary) throw TypeError('boundary is a mandatory param');
		if (!(boundary instanceof Rectangle)) throw TypeError('boundary should be a Rectangle');
		this._boundary = boundary;
	}
	// Getters
	get boundary(){ return this._boundary }
	// Setters

	// Methods
	draw( ctx, camera, viewport ){
    const { left, right, width, height } = this.boundary

		// Create a radial gradient
		var gradient = ctx.createRadialGradient(
			width / 2 - camera.left,
			height / 2 - camera.top,
			0,
			width / 2 - camera.left,
			height / 2 - camera.top,
			width / 2 ); // context.createRadialGradient(x0,y0,r0,x1,y1,r1);

		// Add three color stops
		gradient.addColorStop(0, 'rgb(31,63,0)')
		gradient.addColorStop(.5, 'rgb(135,91,54)')
		gradient.addColorStop(1, 'rgb(31,63,0)')

		ctx.fillStyle = gradient

		ctx.fillRect(
			left - camera.left,
			right - camera.top,
			width,
			height)
		
		ctx.beginPath();
		ctx.lineWidth = 3/ viewport.aspectRatio
		ctx.strokeStyle = "teal"
		ctx.rect(
			(-camera.left / viewport.aspectRatio) + viewport.left,
			(-camera.top / viewport.aspectRatio) + viewport.top, 
			width / viewport.aspectRatio,
			height / viewport.aspectRatio );
		ctx.stroke();
	}
}