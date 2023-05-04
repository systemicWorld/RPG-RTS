
class Audio {
	constructor () {
		console.log( "Audio.constructor()" )
		this._numWavs = 0
		this._mixWavs = []
		this._mixRandomizers = []
	}
	// Getters
	// Setters
	// Methods
	addWavChan(){
		console.log("Audio.addWavChan()")

		let clone = document.body.querySelector( "#template-wavChannel" ).cloneNode( true )
		document.body.querySelector( "#mixer" ).appendChild( clone )
		clone.classList.remove( "template" )

		clone.querySelector( ".wavNum" ).textContent = this._numWavs
		let range = clone.querySelector( ".volRange" )
		range.value = "100"
		clone.querySelector(".volValue").value = 100
		clone.querySelector( ".durRange" ).value = 0

		this._mixWavs.push( clone )
		let rando = new Randomizer() 
		this._mixRandomizers.push( rando )
		let minDelay = clone.querySelector( ".minDelay" )
		let maxDelay = clone.querySelector( ".maxDelay" )
		rando.minDelayEl = minDelay
		rando.maxDelayEl = maxDelay

		this._numWavs++
	}
	volumeSync ( element ) { // 
		//console.info("Audio.volumeSync()")
		let volume = element.value
		let parentNode = element.parentNode
		parentNode.querySelector(".volValue").value = volume
		parentNode.querySelector(".volRange").value = volume
		return volume
	}
	volAdjust( element ) {
		//console.info("menu.volAdjust()")
		element.parentNode.querySelector( "audio" ).volume = this.volumeSync ( element ) / 100 // audio volume is normalized
	}
	wavFileLoad( element ){
		console.log("Audio.wavFileLoad()")
		let wavChann = element.parentNode

		let fileSplit = element.value.split( "\\" ) // C:\fakepath\...wav  <- standard fill for browsers
		let fileName = fileSplit[ fileSplit.length - 1 ]
		let audioEl = wavChann.querySelector( "audio" )
		audioEl.querySelector( "source" ).src = "audio/wav/" + fileName
		audioEl.autoplay = true
		audioEl.load()
		audioEl.loop = true
		
		audioEl.addEventListener("durationchange", ()=>{
			let seconds = audioEl.duration
			wavChann.querySelector( ".durRange" ).max = seconds
			wavChann.querySelector( ".durLabel" ).textContent = " / " + seconds.toFixed(2)	
		});
		audioEl.addEventListener("timeupdate", ()=>{
			let seconds = audioEl.currentTime
			wavChann.querySelector( ".durRange" ).value = seconds
			wavChann.querySelector( ".curLabel" ).textContent = seconds.toFixed(2)
		})

		wavChann.querySelector(".fa-pause").style.display = "inline" // pause button
		wavChann.querySelector(".fa-play").style.display = "none" // play button
	}
	currentTime( element ){
		console.info("Audio.currentTime()")
		let wavChann = element.parentNode
		let audioEl = wavChann.querySelector( "audio" )
		audioEl.currentTime = element.value // will trigger timeupdate event listener
	}
	wavRandomize( button ) {
		console.log("Audio.wavRandomize()")
		button.parentNode.querySelectorAll("*").forEach( ( element )=>{element.style.opacity=1}) // Activate the controls
		let id = button.parentNode.parentNode.querySelector( ".wavNum" ).textContent
		console.log("id:"+id)

		let audioElement = this._mixWavs[id].querySelector("audio")
		// Set up randomizer
		let randomizer = this._mixRandomizers[id]
		randomizer.audio = audioElement
		randomizer.randomized = true
	}
	play( button ){
		console.log("Audio.play()")
		let wavChann = button.parentNode
		wavChann.querySelector("audio").play()
		button.style.display = "none"
		wavChann.querySelector(".fa-pause").style.display = "inline"
	}
	pause( button ){ // pause button press
		console.log("Audio.pause()")
		let wavChann = button.parentNode
		wavChann.querySelector("audio").pause()
		button.style.display = "none"
		wavChann.querySelector(".fa-play").style.display = "inline"
	}
	saveMix ( ) {
		console.info("Audio.saveMix()")
		// JSON example below
		/*
		{
			"mixName":"Tavern Lulz",
			"wavChannels":
			[
				{
					"fileName":"piano.wav"
					"minDelay":0
					"maxDelay":0
				}
			]
		}
		*/
		let jsonObj = {}
		jsonObj.mixName = document.body.querySelector( "#mixName" ).value
		jsonObj.wavChannels = []
		for ( let i = 0; i < this._mixWavs.length; i++ ) {
			let wav = this._mixWavs[i]
			let jsonWav = {}
			jsonWav.fileName = wav.querySelector( "source" ).src.split("/").pop()
			let ization = this._mixRandomizers[i]
			jsonWav.minDelay = ization.minDelay
			jsonWav.maxDelay = ization.maxDelay
			jsonObj.wavChannels.push(jsonWav)
		}
		let fileString = JSON.stringify(jsonObj)
		console.log(fileString)
		// DIFFER TO C++ here
	}
}
/*
class WavChannel {
	constructor ( id ) {
		console.info("WavChannel.constructor()")
		this._fileName = ""
		this._currentTime = 0
		this._duration = 0
		this._looping = false
		this._paused = false
		this._playing = false

		this._wavChannel
		this._chanLabel
		this._chanFile
		this._volRange
		this._volNumber
		this._durRange
		this._curLabel
		this._audioEl
	}
	// Getters
	// Setters
	// Methods
	cloneGUI () {
		console.info("WavChannel.cloneGUI()")

		this._wavChannel = document.body.querySelector( "#template-wavChannel" ).cloneNode( true )
		this._wavChannel.classList.remove( "template" )

		document.body.querySelector( "#mixer" ).appendChild( this._wavChannel )

		this._chanLabel = this._wavChannel.querySelector( ".chanLabel" )//.textContent = this._wavChans
		this._chanLabel.textContent = this._channelNumber
		//
		this._volRange = this._wavChannel.querySelector( ".volRange" )
		this._volRange.value = "100"
		
		this._volNumber = this._wavChannel.querySelector(".volValue")
		this._volNumber.value = 100

		this._durRange = this._wavChannel.querySelector( ".durRange" )
		this._durRange.value = 0

		this._curLabel = this._wavChannel.querySelector( ".curLabel" )
		this._curLabel.textContent = "0"
	}
	load ( element ) {
		console.info("WavChannel.load()")
		let wavChann = element.parentNode

		let split = element.value.split( "\\" ) // remove fake file path
		let fileName = split[ split.length - 1 ] // last index is the file name
		let audioEl = wavChann.querySelector( "audio" )
		audioEl.querySelector( "source" ).src = "audio/wav/" + fileName
		audioEl.autoplay = true
		audioEl.load()
		audioEl.loop = true
		
		audioEl.addEventListener("durationchange", ()=>{
			let seconds = audioEl.duration
			this.durRange.max = seconds
			this.durLabel.textContent = " / " + seconds.toFixed(2)	
		});
		audioEl.addEventListener("timeupdate", ()=>{
			let seconds = audioEl.currentTime
			this.durRange.value = seconds
			this.curLabel.textContent = seconds.toFixed(2)
		})

		wavChann.querySelector(".fa-pause").style.display = "inline"
		wavChann.querySelector(".fa-play").style.display = "none"
	}
}
*/
class Randomizer {
	constructor(){
		console.info("Randomizer.constructor()")
		this._audio = null // HTML audio element
		this._randomized = false
		this._minDelay = 0
		this._maxDelay = 0
		this._minDelayEl
		this._maxDelayEl
	}
	// Getters
	get audio() { return this._audio }
	get randomized() { return this._randomized }
	get minDelay() { return this._minDelay }
	get maxDelay() { return this._maxDelay }
	get playTime() { return this._playTime }
	// Setters
	set audio( element ) { 
		this._audio = element

		element.autoPlay = false
		element.currentTime = 0
		element.loop = false

		this.play()
	}
	set randomized( boolean ) { this._randomized = boolean }
	set minDelay( seconds ) { 
		this._minDelay = parseInt( seconds )
		if( this._maxDelay < this._minDelay ){
			this._maxDelay = this._minDelay
			this._maxDelayEl.value = this._minDelay
		}
	}
	set maxDelay( seconds ) { 
		this._maxDelay = parseInt( seconds )
		if( this._maxDelay < this._minDelay ) {
			this._minDelay = this._maxDelay
			this._minDelayEl.value = this._maxDelay
		}
	}
	set playTime( seconds ) { this._playTime = parseInt( seconds ) }
	set minDelayEl ( element ) {
		this._minDelayEl = element
		this._minDelayEl.oninput = ()=>{ this.minDelay = parseInt( this._minDelayEl.value ) }
	}
	set maxDelayEl ( element ) {
		this._maxDelayEl = element
		this._maxDelayEl.oninput = ()=>{ this.maxDelay = parseInt( this._maxDelayEl.value ) }
	}
	// Methods
	play(){
		console.log("Randomizer.play()")
		this._audio.play()

		this._audio.onended = ()=>{
			console.info("randomized audio ended..")
			console.info("playing again sometime between " + this._minDelay + " and " + this._maxDelay + " milliseconds!")
			let repeatDelay = util.randomLowHigh ( this._minDelay, this._maxDelay )
			console.log("time chosen:"+repeatDelay)
			setTimeout( ()=>{
				this.play()
			}, repeatDelay )
		}
	}
}




let util = new Utilities()
let audio = new Audio()