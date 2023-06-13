class QuadTree {
	constructor( maxGenerations, parent, generation) {
		this._parent = parent || null
		this._children = []
        //this._intersections = []
		this._generation = generation || 0
        this._maxGenerations = maxGenerations || 0
        this._left = 0
        this._top = 0
        this._width = 0
        this._height = 0
        this._right = this._left + this._width
        this._bottom = this._top + this._height
        //
        this._contents = []
	}
	// GETTERS
	get parent() { return this._parent }
	get children() { return this._children }
	get generation() { return this._generation }
    get maxGenerations() { return this._maxGenerations }
    get left() { return this._left }
    get top() { return this._top }
    get width() { return this._width }
    get height() { return this._height }
    get right() { return this._right }
    get bottom() { return this._bottom }
    get contents() { return this._contents }
	// SETTERS
	set parent( newParent ) { this._parent = newParent }
	set children( newChildren ) { this._children = newChildren }
	set generation( newGeneration ) { this._generation = newGeneration }
    set maxGenerations( newMax ) { this._maxGenerations = newMax }
    set left( newLeft ) { 
        this._left = newLeft
        this._right = this._left + this._width }
    set top( newTop ){ 
        this._top = newTop
        this._bottom = this._top + this._height }
    set width( newWidth ) {
        this._width = newWidth
        this._right = this._left + this._width }
    set height( newHeight ) {
        this._height = newHeight
        this._bottom = this._top + this._height }
    set contents( newContents ) { this._contents = newContents }
	// METHODS
	createNewGeneration() {
		console.info(`createNewGeneration()`)
    	if( this.children.length ) return console.error(`Didn't create new generation! Quad already has ${this.children.length} children.`)
        if ( this.generation >= this.maxGenerations ) return console.error(`Didn't create new gernation! Maximum generatations set to ${this.maxGenerations}.` )

        let generationNumber = 1 + this.generation
        let halfWidth = 0.5 * this.width
        let halfHeight = 0.5 * this.height
        let newQuad = {}

        for ( let i = 0; i < 2; i++ ){
            for ( let k = 0; k < 2; k++ ){
                newQuad = new QuadTree( this.maxGenerations, this, generationNumber ) 
                newQuad.left = (k % 2 * halfWidth) + this.left
                newQuad.top = (i % 2 * halfHeight) + this.top
                newQuad.width = halfWidth
                newQuad.height = halfHeight
                this.children.push( newQuad )
            }
        }
        console.log(`Children created: ${this.children.length}`)
	}
    print(){
        console.info(`Quad info: Left:${this.left}, Top:${this.top}, Width:${this.width}, Height:${this.height}`)
    }
    draw( ctx, camera, viewport ){
		ctx.beginPath();
		ctx.lineWidth = 3/ viewport.aspectRatio
		ctx.strokeStyle = "orange"
		ctx.rect(
			this._left+(-camera.left / viewport.aspectRatio) + viewport.left,
			this._top+(-camera.top / viewport.aspectRatio) + viewport.top, 
			this._width / viewport.aspectRatio,
			this._height / viewport.aspectRatio );
		ctx.stroke();
	}
    drawDeep( ctx, camera, viewport ){
        this.draw( ctx, camera, viewport )
        if ( this.children.length > 0 ){
            for(let i =0; i < 4; i++){
                this.children[i].drawDeep( ctx, camera, viewport )
            }
        }
    }
    insert( agent ){
        //console.info(`insert(agent)`)

        if(this.children.length){
            let midWidth = 0.5*this.width
            let midHeight = 0.5*this.height

            if( agent.left < midWidth ){
                // agent's left side is in left half
                if( agent.right < midWidth ) {
                    // agent is entirely in left half
                    if( agent.top < midHeight ){
                        // agent starts in top left child doesn't cross verticle  fold
                        if ( agent.bottom < midHeight ) {
                            // agent is bounded by top left child
                            //console.log(`top left`)
                            this.children[0].insert(agent)
                            //this.children[0].print()
                            //agent.print()
                        } else {
                            // agent is on the left horizontal fold
                            // need more variables or containers
                            //console.log(`on fold`)
                            this.children[0].insert(agent)
                            this.children[3].insert(agent)
                        }
                    } else {
                        // agent bounded by bottom left child
                        //console.log(`bottom left`)
                        this.children[2].insert(agent)
                        //this.children[2].print()
                        //agent.print()
                    }
                } else {
                    // agent starts in left half and ends in right half
                    if( agent.bottom < midHeight ) {
                        // agent is on top verticle fold
                        //console.log(`on fold`)
                        this.children[0].insert(agent)
                        this.children[1].insert(agent)
                    } else {
                        if( agent.top > midHeight ){
                            // agent is on bottom verticle fold
                            //console.log(`on fold`)
                            this.children[2].insert(agent)
                            this.children[3].insert(agent)
                        } else {
                            // agent is on center
                            //console.log(`on center`)
                            this.children[0].insert(agent)
                            this.children[1].insert(agent)
                            this.children[2].insert(agent)
                            this.children[3].insert(agent)
                        }
                    }
                }
            } else {
                // agent's left side is in right half
                if( agent.top > midHeight ) {
                    // agent is entirely in bottom right
                    //console.log(`bottom right`)
                    this.children[3].insert(agent)
                    //this.children[3].print()
                    //agent.print()
                } else {
                    // agent may cross right horizontal fold
                    if(agent.bottom < midHeight ){
                        // agent is bounded by top right child
                        //console.log(`top right`)
                        this.children[1].insert(agent)
                        //this.children[1].print()
                        //agent.print()
                    } else {
                        // agent is on right horizontal fold
                        // need stuff
                        //console.log(`on fold`)
                        this.children[1].insert(agent)
                        this.children[2].insert(agent)
                    }
                }
            }
        }else{
            this.contents.push(agent)
            //console.log(`Agent inserted in generation ${this.generation}`)
            //return this.contents.slice(0, -1)
        }
    }
    remove(){
        console.info(`remove()`)
    }
    clear(){
        console.info(`clear()`)

        this.contents = []
    }
    intersecting(ctx, camera, viewport ){
        //console.info(`intersecting()`)
        //console.log(`generation:${this.generation}`)
        return
        if(this.children.length){
            //console.log('children')
            for( let i = 0; i < this.children.length; i++ ){
                this.children[i].intersecting( ctx, camera, viewport )
            }
        }else{
            for( let k = 0; k < this.contents.length; k++ ){
                this.contents[k].highlight( ctx, camera, viewport )
            }
        }
    }


}