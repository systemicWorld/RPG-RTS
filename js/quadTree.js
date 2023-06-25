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
	set generation( int ) { this._generation = int }
    set maxGenerations( int ) { this._maxGenerations = int }
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
    set contents( array ) { this._contents = array }
	// METHODS
	addGeneration() {
		// console.info(`createNewGeneration()`)
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
        // console.log(`Children created: ${this.children.length}, generation: ${generationNumber}`)
	}
    addGenerations( depth=2 ) {
        // console.log(`addGenerations()`)
        if( depth < 1 ) return console.error(`Depth must be greater than zero`)
        if( this.children.length ) return console.error(`Didn't create new generation! Quad already has ${this.children.length} children.`)
        if( this.generation >= this.maxGenerations ) return console.error(`Didn't create new gernation! Maximum generatations set to ${this.maxGenerations}.` )

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
                newQuad.addGenerations( depth-1 )
            }
        }
    }
    print(){
        console.info(`Quad info: Left:${this.left}, Top:${this.top}, Width:${this.width}, Height:${this.height}`)
    }
    draw( ctx, camera, viewport ){
		ctx.beginPath();
		ctx.lineWidth = 1/ viewport.aspectRatio
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
        //console.log('insert()')
        if( this.children.length ){
            let cW = 0.5 * this.width + this.left
            let cH = 0.5 * this.height + this.top
            let l = agent.left
            let r = agent.right
            let t = agent.top
            let b = agent.bottom
            //  0  1 quads
            //  2  3 quads
            //   0   folds.. folds come in handy for tracking over laps.. implement later.
            //  3+1  folds
            //   2   folds
            if( r < cW && b < cH ){ 
                // console.log(`top left`)
                this.children[0].insert( agent )
            } else if( l > cW && b < cH ){
                // console.log(`top right`)
                this.children[1].insert( agent )
            } else if( r < cW && t > cH ){
                // console.log(`bottom left`)
                this.children[2].insert( agent )
            } else if( l > cW && t > cH ){
                // console.log(`bottom right`)
                this.children[3].insert( agent )
            } else if( l < cW && r > cW && b < cH ){
                // console.log(`t fold`)
                this.children[0].insert( agent )
                this.children[1].insert( agent )
                // this.childrenFolds[0].insert( agent )
            } else if(( l < cW && r > cW && t > cH )) {
                // console.log(`b fold`)
                this.children[2].insert( agent )
                this.children[3].insert( agent )
            } else if( t < cH && b > cH && r < cW ){
                // console.log(`l fold`)
                this.children[0].insert( agent )
                this.children[2].insert( agent )
            } else if( t < cH && b > cH && l > cW ){
                // console.log(`r fold`)
                this.children[1].insert( agent )
                this.children[3].insert( agent )
            } else {
                // console.log(`center`)
                this.children[0].insert( agent )
                this.children[1].insert( agent )
                this.children[2].insert( agent )
                this.children[3].insert( agent )
            }
        } else {
            // console.log(`depth:${this.generation}`)
            this.contents.push( agent )
        }
    }    
    
    getInsertions( agent, ins=[] ){
        // console.log(`getInsertions(), ${this.generation}`)
        if( this.children.length ){
            let cW = 0.5 * this.width + this.left
            let cH = 0.5 * this.height + this.top
            let l = agent.left
            let r = agent.right
            let t = agent.top
            let b = agent.bottom
            //  0  1
            //  2  3
            if( r < cW && b < cH ){
                ins.push( ...this.children[0].getInsertions( agent ) )
            } else if( l > cW && b < cH ){
                // console.log(`top right`)
                ins.push( ...this.children[1].getInsertions( agent ) )
            } else if( r < cW && t > cH ){
                // console.log(`bottom left`)
                ins.push( ...this.children[2].getInsertions( agent ) )
            } else if( l > cW && t > cH ){
                // console.log(`bottom right`)
                ins.push( ...this.children[3].getInsertions( agent ) )
            } else if( l < cW && r > cW && b < cH ){
                // console.log(`t fold`)
                ins.push( ...this.children[0].getInsertions( agent ) )
                ins.push( ...this.children[1].getInsertions( agent ) )
            } else if(( l < cW && r > cW && t > cH )) {
                // console.log(`b fold`)
                ins.push( ...this.children[2].getInsertions( agent ) )
                ins.push( ...this.children[3].getInsertions( agent ) )
            } else if( t < cH && b > cH && r < cW ){
                // console.log(`l fold`)
                ins.push( ...this.children[0].getInsertions( agent ) )
                ins.push( ...this.children[2].getInsertions( agent ) )
            } else if( t < cH && b > cH && l > cW ){
                // console.log(`r fold`)
                ins.push( ...this.children[1].getInsertions( agent ) )
                ins.push( ...this.children[3].getInsertions( agent ) )
            } else {
                // console.log(`center`)
                ins.push( ...this.children[0].getInsertions( agent ) )
                ins.push( ...this.children[1].getInsertions( agent ) )
                ins.push( ...this.children[2].getInsertions( agent ) )
                ins.push( ...this.children[3].getInsertions( agent ) )
            }
        } else {
            if( this.contents.length ){
                ins.push( ...this.contents )
            }
        }
        return ins
    }
    
    clear(){
        //console.info(`clear()`)
        if( this.children.length ) {
            this.children.forEach((i)=>{ i.clear() })
        } else {
            this.contents = []
        }
    }
}