// Declaring a Class, helps determine what keys user is/has pressing
class Keyboard {
	constructor() {
		this._buffer = []

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
			32: 'fire'
		}
		// create listeners
		window.addEventListener( "keydown", (event)=>{ this.keyDown(this._buffer, event, this._pressedKeys, this._keyMap) } )
		window.addEventListener( "keyup", (event)=>{ this.keyUp(this._buffer, event, this._pressedKeys, this._keyMap) } )
	}
	// Getters
	get pressedKeys() { return this._pressedKeys }
	get buffer() { return this._buffer }
	// Setters
	// Methods
	keyDown( buffer, e, pressedKeys, keyMap ) {
		// console.info(`keyDown(${e.keyCode})`)
		// console.info(`keyUp(${e.type})`)
		let key = keyMap[e.keyCode]
		pressedKeys[key] = true
		buffer.push(e)
	}
	keyUp( buffer, e, pressedKeys, keyMap ) {
		// console.info(`keyUp(${e.keyCode})`)
		// console.info(`keyUp(${e.type})`)
		let key = keyMap[e.keyCode] // use event.key for actual letters
		pressedKeys[key] = false
		buffer.push(e)
	}
}
