class Human {
	constructor( mother, father, sex ) {
		this._mother = mother
        this._father = father
        this._sex = sex
        this._children = []
	}
	// GETTERS
	get mother() { return this._mother }
    get father() { return this._father }
    get sex() { return this._sex }
	// SETTERS
    //
	// METHODS
	addChild( human ) {
		console.info(`addChild(${human})`)
        this._children.push(human)
	}
}