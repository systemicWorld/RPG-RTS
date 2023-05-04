class Utilities {
	binary() {
		return Math.random() >= 0.5 ? 1 : 0
	}
	rollDice ( rolls, sides ) {
		let sum = 0
		for( let i = 0; i < rolls; i++ ) {
			sum += Math.floor( Math.random() * sides ) + 1
		}
		return sum
	}

	gaussianRange( floor, ceiling ) {
		// Returns a float between floor and ceiling which is normally distributed
		console.info(`gaussian(${floor}, ${ceiling})`)

		let range = Math.abs(ceiling - floor)
		let sigma = 0
		for ( let i=0; i < range; i++ ) {
			sigma += Math.random() // a uniformly distributed float between zero and 1 
		}
		return floor + sigma
	}

	randomRGB(){ // return an RGB string
		let r = Math.floor( ( Math.random() * 2 ) + 0 ) * 256,
			g = Math.floor( ( Math.random() * 2 ) + 0 ) * 256,
			b = Math.floor( ( Math.random() * 2 ) + 0 ) * 256

		if( r + g + b != 0 ){ // check for black because black is the background, there should be a reserved color list
			return { r: r, 
					g: g,
					b: b,
					string: `rgb(${r}, ${g}, ${b})` }
		}else{
			return randomRGB()
		}
	}

	randomXY( boundingRectangle ){
		return { x: Math.random() * boundingRectangle.width,
				 y: Math.random() * boundingRectangle.height }
	}

	randomSkinToneRGB(){
		/* Darker to lighter
		    Name: Russet
		    Hex: #8d5524
		    RGB: (141, 85, 36)
		    CMYK: 0, 0.397, 0.744, 0.447

		    Name: Peru
		    Hex: #c68642
		    RGB: (198, 134, 66)
		    CMYK: 0, 0.323, 0.666, 0.223

		    Name: Fawn
		    Hex: #e0ac69
		    RGB: (224, 172, 105)
		    CMYK: 0, 0.232, 0.531, 0.121

		    Name: Mellow Apricot
		    Hex: #f1c27d
		    RGB: (241, 194, 125)
		    CMYK: 0, 0.195, 0.481, 0.054

		    Name: Navajo White
		    Hex: #ffdbac
		    RGB: (255, 219, 172)
		    CMYK: 0, 0.141, 0.325, 0
		*/
		let r, g, b = 0

		switch(this.randomLowHigh(0,4)) {
			case 0:
				r = 141
				g = 85
				b = 36
				break;
			case 1:
				r = 198
				g = 134
				b = 66
				break;
			case 2:
				r = 224
				g = 172
				b = 105
				break;
			case 3:
				r = 241
				g = 194
				b = 125
				break;
			default:
				r = 255
				g = 219
				b = 172
		}

		return { r: r, 
			g: g,
			b: b,
			string: `rgb(${r}, ${g}, ${b})` }
	}

	randomLowHigh( low, high ){ // random number between low and high
		return Math.floor( Math.random() * ( high - low + 1) ) + low
	}

	descriptiveStatistics(set){
		console.log(`descriptiveStatistics(set)`)

		// mean
		// variance
		// standard deviation
		// min, max
		// mode
		// median
	}
}