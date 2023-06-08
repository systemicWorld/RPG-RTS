// Declaring a Class, helps determine what keys user is/has pressing
class Keyboard {
	constructor() {
		this._buffer = [] // buffer of clicked keys 

		this._pressedKeys = {
			menu: false,
			left: false,
			right: false,
			up: false,
			down: false,
			fire: false
		}
		// link action names to keyCodes
		this._keyMap = {
			27: 'menu',
			68: 'right',
			65: 'left',
			87: 'up',
			83: 'down',
			105: 'fire'
		}
		// create listeners
		window.addEventListener( "keydown", (event)=>{ this.keyDown(event, this._pressedKeys, this._keyMap) } )
		window.addEventListener( "keyup", (event)=>{ this.keyUp(event, this._pressedKeys, this._keyMap) } )
	}
	// Getters
	get pressedKeys() { return this._pressedKeys }

	// Setters
	// Methods
	keyDown( e, pressedKeys, keyMap ) {
		//console.info("keyDown("+e.key+")")
    
		let key = keyMap[e.keyCode]
    	pressedKeys[key] = true
	}
	keyUp( e, pressedKeys, keyMap ) {
		//console.info("keyUp("+e.key+")")
		let key = keyMap[e.keyCode] // use event.key for actual letters
		pressedKeys[key] = false
	}
}
