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

	gaussianRandom( mean=0, stdDev=1 ) {
		// Standard Normal variate using Box-Muller transform.
		let u1 = 1 - Math.random() // converting 0<=x<1 to 0<x<=1
		let u2 = Math.random()
		let z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)
		// transform to the desired mean and standard deviation:
		return z * stdDev + mean
	}

	generateGaussianNoise( mean = 0, stdDev = 1 ){
		let two_pi = 2.0 * Math.PI

		//create two random numbers, make sure u1 is greater than epsilon
		let u1 = Math.random() * (1- Number.EPSILON ) + Number.EPSILON
		let u2 = Math.random()

		// compute z0, z1
		let mag = stdDev * Math.sqrt(-2.0 * Math.log(u1))
		let z0 = mag * Math.cos(two_pi * u2) + mean
		let z1 = mag * Math.sin(two_pi * u2) + mean

		return {z0, z1}
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

		let n = set.length
		// mean
		let m = set.reduce((a, b) => a + b) / n

		// variance
		let ss = set.reduce((a, b) => a + ((b-m)^2) / n )
		
		// standard deviation
		let s = Math.sqrt(ss)

		// min, max
		let min = Math.min(...set)
		let max = Math.max(...set)
		// mode
		// median
// Expected output: 1
		console.info(`n=${n}, m=${m}, v=${ss}, stdDev=${s}, min=${min}, max=${max}`)
	}
}