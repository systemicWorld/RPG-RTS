function _main_(){
	let utils = new Utilities() // coding utilities
	let keyboard = new Keyboard() // virtual keyboard
	let mouse = new Mouse()
	
	let audio = new Audio() // GUI linked - wav channels, mixes
	let clock = new Clock() // Real time and game time
	clock.clockDisplay()
	let gamey = new Gamey() // Higher order utilities

	let canvas = document.getElementById("mainCanvas") // Get the canvas element form the page
	let cWidth = canvas.width = window.innerWidth // canvas takes up the width of window
	let cHeight = canvas.height = window.innerHeight // canvas set to inner height of window
	let ctx = canvas.getContext("2d")

	let terrain = new Terrain( .5 * cWidth, .5 * cHeight )
	let gameObjects = []

	let viewport = new Viewport( 0, 0, cWidth, cHeight )
	let camera = new Camera( 0, 0, viewport.width * viewport.aspectRatio, viewport.height * viewport.aspectRatio )
	let gameObjectsOnCamera = [] // good for debugging

	gamey.distributeAgents( utils, gameObjects, terrain, 50 )
	//WHY ARE AGENTS BRING CREATED OUTSIDE OF THE TERRAIN ON THE RIGHT AND BOTTOM???
	let player = gameObjects[0]
	//let badguy = gameOjbects[1]

	setup_game()
	
	function setup_game(){
		console.log(`setup_game()`)

		gamey.colorAgentsBySex( gameObjects )
		gamey.colorAgentsByAge( gameObjects )
	
		player.color = 'yellow'
		player.male = false // player = female = false
		player.age = 21
		camera.center( player.x , player.y )
	
		gamey.mateBehavior ( gamey )
	
		//badguy.color = 'red'
	}

	function update_game( /*currently global SECONDS_PER_TICK*/) {
		// update the state of the world based on determined time step
		// dont update if player wants pause
		
		//clock.clockDisplay() // would be cool to have a clock in game 
		
		if ( keyboard.pressedKeys.menu ) { // escape key pressed === true
			menu.show()
		}

		{ // move player based on keyboard state		
			if( keyboard.pressedKeys.up && !keyboard.pressedKeys.down ) {
				player.y -= player.speed * SECONDS_PER_TICK
			}
			if( keyboard.pressedKeys.right && !keyboard.pressedKeys.left ){
				player.x += player.speed  * SECONDS_PER_TICK
			}
			if( keyboard.pressedKeys.down && !keyboard.pressedKeys.up ) {
				player.y += player.speed * SECONDS_PER_TICK
			}
			if( keyboard.pressedKeys.left && !keyboard.pressedKeys.right ){
				player.x -= player.speed * SECONDS_PER_TICK
			}
		}

		{ // this block is for testing purposes.. allow put the player anywhere instantly with RIGHT click
			if( mouse.pressedButtons.right ) {
				// move the player to click coordinate
				player.y = mouse.y+camera.top
				player.x = mouse.x+camera.left
			}
		}
		// Do AI
		//badguy.avoid( player, SECONDS_PER_TICK )
		//badguy.seek( player, SECONDS_PER_TICK )
		for( let i = 1; i < gameObjects.length; i++ ) {
			gameObjects[i].avoid( player, SECONDS_PER_TICK )
			gameObjects[i].bond(SECONDS_PER_TICK)
		}
		/* CAMERA ///////////////////////////////////////////////
		// Adjust at end to determine what's an intersting view
		// Rule 1: Player never leaves the view
		///////////////////////////////////////////////////////*/
		camera.nearEdgeAsymptotic( player.x, player.y, terrain.width, terrain.height )
	}

	function display_game( ) { // FPS is throttled, and there's no interpolation
		// clear the screen
		ctx.fillStyle = 'black'
		ctx.fillRect( 0, 0, cWidth, cHeight )
		// draw the state of the world // should be draw the state of what the camera bounds
		terrain.draw( ctx, camera, viewport ) // non-performant??
	
    	let drawnObjects = []
		for( let i = gameObjects.length-1; i >= 0; i-- ) { // player is 0 so player gets drawn last/on top
			if ( gameObjects[i].draw( ctx, camera, viewport ) == true ) {
				drawnObjects.push(gameObjects[i])
			}
		}
		gameObjectsOnCamera = drawnObjects
		//console.log("Objects drawn on cam: "+gameObjectsOnCamera.length)
		//camera.draw( ctx ) // draw bounding box for debug purposes
		//viewport.draw( ctx )
	}
	
	function panic(){
		console.error("panic()")
		dTime = 0 // discard the unsimulated time
	}

	const MAX_TICKS_PER_SECOND = 30
	const TIME_PER_STEP = 1000 / MAX_TICKS_PER_SECOND // 1000 milliseconds per 60 updates
	const SECONDS_PER_TICK = TIME_PER_STEP / 1000
	const MAX_FPS = 20 // The maximum FPS to allow // 30 FPS limit on FireFox (May 2020)
	const TIME_PER_PAINT = 1000 / MAX_FPS
	let lastFrameTimeMs = 0 // The last time the loop was run
	let dTime = 0 // game or simulation time
	let numUpdateSteps = 0
	let fps = 0 // initial assumption
	let framesThisSecond = 0
	let lastFpsUpdate = 0
	function mainLoop( timestamp ) {
		// throttle Frames per second
		if( timestamp < lastFrameTimeMs + TIME_PER_PAINT ){
			requestAnimationFrame( mainLoop )
			return
		}
		dTime += timestamp - lastFrameTimeMs
		lastFrameTimeMs = timestamp

		// attempt to simulate a specific number of steps per second
		numUpdateSteps = 0
		while( dTime >= TIME_PER_STEP ){
			update_game()
			dTime -= TIME_PER_STEP
			if( ++numUpdateSteps >= 240 ){
				panic()
				break
			}
		}

		// keep track of painting performance
		if( timestamp > lastFpsUpdate + 1000 ) { //update every second
			fps = 0.25 * framesThisSecond + (1 - 0.25) * fps // compute the new FPS

			lastFpsUpdate = timestamp
			document.title = framesThisSecond
			framesThisSecond = 0
		}
		framesThisSecond++

		display_game()
		requestAnimationFrame( mainLoop )
	}

	// Start things off
	requestAnimationFrame( mainLoop )
}