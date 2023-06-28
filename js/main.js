function _main_(){
	let utils = new Utilities() // coding utilities
	let keyboard = new Keyboard() // virtual keyboard
	let mouse = new Mouse()
	
	let audio = new Audio() // GUI linked - wav channels, mixes
	let gamey = new Gamey() // Higher order utilities

	let canvas = document.getElementById("mainCanvas") // Get the canvas element form the page
	let cWidth = canvas.width = window.innerWidth // canvas takes up the width of window
	let cHeight = canvas.height = window.innerHeight // canvas set to inner height of window
	let ctx = canvas.getContext("2d")

	let viewport = new Viewport( new Rectangle( 0, 0, cWidth, cHeight ) )
	let camera = new Camera( new Rectangle( 0, 0, viewport.boundary.width * viewport.aspectRatio, viewport.boundary.height * viewport.aspectRatio) )

	let terrain = new Terrain( new Rectangle( 0, 0, 1.05 * cWidth, 1.05 * cHeight ) );

	let agents = [] // agents seperate from gameObjects due to a lot of interactions?
	let player = {}
	//let gameObjects = []
	//let gameObjectsOnCamera = [] // good for debugging

	let projectiles = [] // never get added to the quadTree with agents
	let stamps = []
	let quadTree = {}

	setup_game()
	function setup_game(){
		console.log(`setup_game()`)
		gamey.preloadProjectiles( projectiles, 500 ) // 500 seems good to start
		gamey.distributeAgents( utils, agents, terrain, 100)
		player = agents[0]
		//let badguy = gameOjbects[1]
		gamey.colorAgentsBySex( agents )
		gamey.colorAgentsByAge( agents )
	
		player.color = 'yellow'
		player.male = false // player = female = false
		player.age = 21
		camera.center( player.x , player.y )
		//badguy.color = 'red'
		/* QuadTree */
		quadTree = new QuadTree( 3, undefined, 0, new Rectangle( 0, 0, terrain.boundary.width, terrain.boundary.height ) )
		quadTree.addGenerations( 1 )
	}

	function update_game() {
		// Use SECONDS_PER_TICK for simulation
		// update the state of the world based on determined time step
		// dont update if player wants pause
		if ( keyboard.pressedKeys.menu ) { // escape key pressed === true
			menu.show()
		}

		while( keyboard.buffer.length > 0 ){
			let event = keyboard.buffer.shift()
			if( event.type == `keydown`	){
				switch( keyboard._keyMap[event.keyCode] ){
					case `up`:
						player.vY = -player._speed
						break
					case `left`:
						player.vX = -player._speed
						break
					case `down`:
						player.vY = player._speed
						break;
					case `right`:
						player.vX = player._speed
						break
					case `fire`:
						gamey.fireProjectile( projectiles, player, stamps )
						break
				}
			}else if( event.type == `keyup`){
				switch( keyboard._keyMap[event.keyCode] ){
					case `up`:
					case `down`:
						player.vY = 0
						break
					case `left`:
					case `right`:
						player.vX = 0
						break
				}
			}
		}

		while( mouse.buffer.length > 0 ){
			switch( mouse.buffer.shift() ){
				case `left`:
					// console.log(`left click`)
					player.y = mouse.y + camera.boundary.top
					player.x = mouse.x + camera.boundary.left
					gamey.createAgentNextToAgent( utils, agents, agents[0] )
					break;
				case `middle`:
					// console.log(`mid click`)
					break;
				case `right`:
					// console.log(`right click`)
					// move the player to click coordinate
					player.y = mouse.y + camera.boundary.top
					player.x = mouse.x + camera.boundary.left
					break;
				default:
					console.error(`undefined button clicked`)
			}
		}
	
		// Do AI
		for( let i = 0; i < agents.length; i++ ){
			// agents[i].avoid( player, SECONDS_PER_TICK )
			// agents[i].bond(SECONDS_PER_TICK)
			agents[i].act( player, SECONDS_PER_TICK )
		}

		for( let i = 0, agent = {}; i < agents.length; i++ ){
			agent = agents[i]
			agent.nearby = []
			quadTree.insert( agent )
		}

		player.nearby = quadTree.getInsertions( player.boundary )
		player.checkIntersections() // turn touched red

		projectiles.forEach(( i )=>{
			if( !i._active ) return
			i.move( SECONDS_PER_TICK )
			if( quadTree.boundary.intersects( i.boundary )){
				i.checkIntersections( quadTree.getInsertions( i.boundary ))
			}else{
				i._active = false	
			}
		})

		/* CAMERA ///////////////////////////////////////////////
		// Adjust at end to determine what's an intersting view
		// Rule 1: Player never leaves the view
		///////////////////////////////////////////////////////*/
		camera.nearEdgeAsymptotic( player.x, player.y )
		quadTree.clear()
	}

	let drawTime = 0
	function display_game( ) { // FPS is throttled by browsers, and there's no interpolation
		// Use dTime/1000 for drawing
		drawTime = dTime/1000
		// clear the screen, may not be needed in the future ..
		ctx.fillStyle = 'black'
		ctx.fillRect( 0, 0, cWidth, cHeight )
		// draw the state of the world // should be draw the state of what the camera bounds
		terrain.draw( drawTime, ctx, camera.boundary, viewport ) // non-performant??

    // let drawnObjects = []
		for( let i = agents.length-1; i >= 0; i-- ) { // player is 0 so player gets drawn last/on top
			agents[i].draw( drawTime, ctx, camera.boundary, viewport )
			// if ( agents[i].draw( drawTime, ctx, camera.boundary, viewport ) ) {
			// 	drawnObjects.push(agents[i])
			// }
		}
		
		projectiles.forEach((i)=>{
			if( !i._active ) return
			i.draw( drawTime, ctx, camera.boundary, viewport )
		})

		stamps.forEach((i)=>{
			i.draw( drawTime, ctx, camera.boundary, viewport )
		})
		
		// Draw any of the below for debug
		// camera.draw( ctx ) // draw bounding box for debug purposes
		// viewport.draw( ctx )
		// quadTree.drawDeep( ctx, camera.boundary, viewport )

		// console.log("Objects drawn on cam: "+drawnObjects.length)
	}

	function panic(){
		console.error("panic()")
		dTime = 0 // discard the unsimulated time
	}
	const MAX_TICKS_PER_SECOND = 30
	const TIME_PER_STEP = 1000 / MAX_TICKS_PER_SECOND // 1000 milliseconds per 60 updates
	const SECONDS_PER_TICK = TIME_PER_STEP / 1000
	const MAX_FPS = 60 // The maximum FPS to allow // 30 FPS limit on FireFox (May 2020)
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
			update_game() // simulation uses SECONDS_PER_TICK
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

		display_game() // Visuals use dTime
		requestAnimationFrame( mainLoop )
	}

	// Start things off
	requestAnimationFrame( mainLoop )
}