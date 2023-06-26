class Terrain {
	constructor( boundary ) {
		if (!boundary) throw TypeError('boundary is a mandatory param')
		if (!(boundary instanceof Rectangle)) throw TypeError('boundary should be a Rectangle')
		this._boundary = boundary;
	}
	// Getters
	get boundary(){ return this._boundary }
	// Setters
	set boundary( boundary ){ 
		if (!boundary) throw TypeError('boundary is a mandatory param')
		if (!(boundary instanceof Rectangle)) throw TypeError('boundary should be a Rectangle')
		this._boundary = boundary
	}
	// Methods
	draw( ctx, camera, viewport ){
    const { left, top, width, height } = this._boundary
		const { left: viewLeft, top: viewTop } = viewport.boundary
		const ar = viewport.aspectRatio
	
		// Create a radial gradient
		let gradient = ctx.createRadialGradient(width / 2 - camera.left,
																						height / 2 - camera.top,
																						0,
																						width / 2 - camera.left,
																						height / 2 - camera.top,
																						width / 2 ) // context.createRadialGradient(x0,y0,r0,x1,y1,r1);

		// Add three color stops
		gradient.addColorStop(0, 'rgb(31,63,0)')
		gradient.addColorStop(.5, 'rgb(135,91,54)')
		gradient.addColorStop(1, 'rgb(31,63,0)')

		ctx.fillStyle = gradient

		ctx.fillRect(left - camera.left,
								 top - camera.top,
								 width,
								 height)
		
		ctx.beginPath()
		ctx.lineWidth = 3/ ar
		ctx.strokeStyle = "teal"
		ctx.rect((-camera.left / ar) + viewLeft,
						 (-camera.top / ar) + viewTop, 
						 width / ar,
						 height / ar )
		ctx.stroke()
	}
}