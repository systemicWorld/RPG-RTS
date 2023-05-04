/*


Instead of having a codified locatin like below which reminds me of Starcraft like map editor

what about some kind of pheramone based locations like in sim ant?
	ie. a contigous hexa-grid that receives tags





*/


class Location{
	constructor( gameID, x, y, radius, speed, color ){
		this._id = gameID

		if( radius <= 0 ){
			radius = 1
		}
		this._radius = radius || 1 // size in meters

		if( x < radius ){
			x = radius
		}
		this._x = x || 0 // 0 is farthest left in game world
		
		if( y < radius ){
			y = radius
		}
		this._y = y || 0 // 0 is highest up in game world
		
		this._speed = speed * 100 || 10 // meters per second (10px per meter)
		this._color = color || 'yellow'

		// Bounding Box
		this._left = this._x - this._radius
		this._top = this._y - this._radius
		this._right = this._x + this._radius
		this._bottom = this._y + this._radius

	}
	// Getters
	get id() { return this._id }
	get x() { return this._x }
	get y() { return this._y }
	get radius() { return this._radius }
	get speed() { return this._speed }
	get left() { return this._left }
	get top() { return this._top }
	get right() { return this._right }
	get bottom() { return this._bottom }
	// Setters
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
	set color( string ){
		this._color = string // CSS colors, or RGB[A]() string
	}
	// Methods
	draw( ctx, camera, viewport ){
		let onCam = false
		// check if within camera bounds
		if( this._top > camera.bottom ||
			this._right < camera.left ||
			this._bottom < camera.top ||
			this._left > camera.right ){
			return
			ctx.fillStyle = "rgba(200,100,200,.5)" // off camera
		}else{
			ctx.fillStyle = this._color//gradient;
			onCam = true
		}

		if( onCam == true){
			// Define a circular path
			ctx.beginPath();
			// ctx.arc(this._x, this._y, this._radius, 0 , 2 * Math.PI);
			
			ctx.arc(((this._x - camera.left) / viewport.aspectRatio) + viewport.left,
					((this._y - camera.top) / viewport.aspectRatio) + viewport.top,
					this._radius / viewport.aspectRatio,
					0 , 2 * Math.PI);

			// Create a radial gradient
			// var gradient = ctx.createRadialGradient( this._x, this._y, 0, this._x, this._y, this._radius);

			// Add three color stops
			// gradient.addColorStop(0, this._color);
			// gradient.addColorStop(1, 'rgba(0,0,0,0)');

			// Set the fill style and draw a circle
			ctx.fill();
		} else {
			ctx.beginPath();
			ctx.arc(this._x, this._y, this._radius, 0 , 2 * Math.PI);
			ctx.fill();
		}
	}
}