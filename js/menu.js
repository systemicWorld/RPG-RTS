class Menu {
	constructor () {
		console.log("Menu.constructor()")
		this._menu = document.body.querySelector( "#guiWrap" ) || false // fails if constructed at program start
		this._wavChans = 0
	}
	// Getters
	// Setters
	// Methods
	construct () {
		this._menu = document.body.querySelector( "#guiWrap" )
	}
	show () {
		console.log("Menu.show()")
		this.construct()
		if ( this._menu.style.visibility === "hidden") {
			this._menu.style.visibility = "visible"		
		}
	}
	hide () {
		console.log("Menu.hide()")
		this.construct()
		this._menu.style.visibility = "hidden"
	}
}

let menu = new Menu() // this allows main.html to access

/* Menu Rules
1. Allow skipping of splash screens
2. Continue play is always the first option
3. No cut away to montages while idle, or before menu loads
4. Automatically save settings once they're changed
5. No reminding of auto saves
6. Subtitles standard in video/visuals.. not audio/sound
	Y-axis inversion standard in controls, not gameplay
7. Give option to invert Y-axis before game begins
8. on console, A to advance, B to go back
9. Map shall not require more than two buttons to access, perferably one, or none
10.Always Allow The Player To Quit To Desktop rapidly
*/