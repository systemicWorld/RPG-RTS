class Mouse {
	constructor() {
		this._x
		this._y
		
		this._buffer = [] // buffer of clicked buttons 

		this._pressedButtons = {
			left: false,
			right: false,
			middle: false,
		}
		this._buttonMap = {
			0: 'left',
			2: 'right',
			1: 'middle'
		}
		//timestamping
		this._downTimes = {
			left: -1,
			right: -1,
			middle: -1
		}
		// create listeners
		window.addEventListener( "mousemove", (event)=>{ this.move(event) } )
		window.addEventListener( "mousedown", (event)=>{ this.buttonDown(event, this._pressedButtons, this._buttonMap, this._downTimes) } )
    	window.addEventListener( "mouseup", (event)=>{ this.buttonUp(event, this._pressedButtons, this._buttonMap, this._downTimes) } )
		window.addEventListener( "click", (event)=>{ this.buttonClick(this._buffer, event, this._buttonMap) } )
	}
	// Getters
	get x() { return this._x }
	get y() { return this._y }
	get pressedButtons() { return this._pressedButtons }
	get buffer() { return this._buffer }
	// Setters
	set x( x ) {
		this._x = x
	}
	set y( y ) {
		this._y = y
	}
	// Methods
	move( e ) {
		//console.info("move("+e.clientX+")")
		this._x = e.clientX
		this._y = e.clientY
	}
	buttonDown( e, pressedButtons, buttonMap, downTimes ) {
		console.info(`buttonDown(${e.button}, time:${e.timeStamp})`)
		let button = buttonMap[e.button]
		pressedButtons[button] = true
		this._x = e.clientX
		this._y = e.clientY
		downTimes[button] = e.timeStamp
	}
	buttonUp( e, pressedButtons, buttonMap, downTimes ) {
		console.info(`buttonUp(${e.button}, time:${e.timeStamp})`)
		let button = buttonMap[e.button] // use event.button for actual letters
		pressedButtons[button] = false
		let dT = e.timeStamp - downTimes[button]
		console.log(`timeLapsed:${dT}`)
	}
	buttonClick( buffer, e, buttonMap ) {
		console.info(`buttonClick(${e.button})`)
		let button = buttonMap[e.button] // use event.button for actual letters
		buffer.push(button)
		console.log(buffer)
	}
}