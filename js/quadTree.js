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
        /* 0 1
           2 3 */
        if(this.children.length){
            let midWidth = 0.5*this.width
            let midHeight = 0.5*this.height

            if( agent.left < midWidth ){ // agent's left side is in left half
                if( agent.right < midWidth ) { // agent is entirely in left half
                    if( agent.top < midHeight ){ // agent starts in top left child doesn't cross verticle  fold
                        if ( agent.bottom < midHeight ) {
                            // console.log(`top left`)
                            this.children[0].insert(agent)
                        } else {
                            // console.log(`left fold`)
                            this.children[0].insert(agent)
                            this.children[2].insert(agent)
                        }
                    } else {
                        //console.log(`bottom left`)
                        this.children[2].insert(agent)
                    }
                } else { // agent starts in left half and ends in right half
                    if( agent.bottom < midHeight ) {
                        // console.log(`on top fold`)
                        this.children[0].insert(agent)
                        this.children[1].insert(agent)
                    } else {
                        if( agent.top > midHeight ){
                            //console.log(`bottom fold`)
                            this.children[2].insert(agent)
                            this.children[3].insert(agent)
                        } else {
                            //console.log(`center`)
                            this.children[0].insert(agent)
                            this.children[1].insert(agent)
                            this.children[2].insert(agent)
                            this.children[3].insert(agent)
                        }
                    }
                }
            } else { // agent's left side is in right half
                if( agent.top > midHeight ) {
                    //console.log(`bottom right`)
                    this.children[3].insert(agent)
                } else { // agent may cross right horizontal fold
                    if( agent.bottom < midHeight ){
                        //console.log(`top right`)
                        this.children[1].insert(agent)
                    } else {
                        //console.log(`right fold`)
                        this.children[1].insert(agent)
                        this.children[3].insert(agent)
                    }
                }
            }
        }else{
            this.contents.push(agent)
            //console.log(`Agent inserted in generation ${this.generation}`)
            // return this.contents.slice(0, -1)
            // return the indentity of the containing quad
            agent.nearby = this.contents
        }
    }

    insert2( agent ){
        //console.log('insert2()')
        if( this.children.length ){
            let cW = 0.5 * this.width
            let cH = 0.5 * this.height
            let l = agent.left
            let r = agent.right
            let t = agent.top
            let b = agent.bottom
            //  0  1
            //  2  3
            if( r < cW && b < cH ){ 
                console.log(`top left`)
                this.children[0].insert2( agent ) // top left 
            } else if( l > cW && b < cH ){
                console.log(`top right`)
                this.children[1].insert2( agent ) // top right
            } else if( r < cW && t > cH ){
                console.log(`bottom left`)
                this.children[2].insert2( agent ) // bottom left
            } else if( l > cW && t > cH ){
                console.log(`bottom left`)
                this.children[3].insert2( agent ) // bottom right
            } else if( l < cW && r > cW ){
                if( b < cH ){ // t fold
                    console.log(`t fold`)
                    this.children[0].insert2( agent )
                    this.children[1].insert2( agent )
                } else { // b fold
                    console.log(`b fold`)
                    this.children[2].insert2( agent )
                    this.children[3].insert2( agent )
                }
            } else if( t < cH && b > cH ){
                if( r < cW ){ // l fold
                    console.log(`l fold`)
                    this.children[0].insert2( agent )
                    this.children[2].insert2( agent )
                } else { // right f
                    console.log(`r fold`)
                    this.children[1].insert2( agent )
                    this.children[3].insert2( agent )
                }
            } else /*if( l < cW && r > cW && t < cH && b > cH )*/{
                console.log(`center`)
                this.children[0].insert2( agent )
                this.children[1].insert2( agent )
                this.children[2].insert2( agent )gg
                this.children[3].insert2( agent )
            }
        } else {
            this.contents.push( agent )
        }
    }

    remove(){
        console.info(`remove()`)
    }
    
    clear(){
        //console.info(`clear()`)
        if( this.children.length ) {
            this.children.forEach((i)=>{ i.clear() })
        } else {
            this.contents = []
        }
    }

    intersecting(ctx, camera, viewport ){
        //console.info(`intersecting()`)
        //console.log(`generation:${this.generation}`)
    
        if(this.children.length){
            //console.log('children')
            for( let i = 0; i < this.children.length; i++ ){
                this.children[i].intersecting( ctx, camera, viewport )
            }
        }else{
            // BRUTE FORCE METHOD ..
            let a = {}, b = {}, d = 0.0, k = 0, f = 0, l = this.contents.length
            for( k = 0; k < l; k++ ){
                a = this.contents[k]
                //console.log(`a.x=${a.x} a.y=${a.y}`)
                for( f = 0; f < l; f++ ){
                    //console.log(`a.id=${a.id}, b.id=${b.id}`)
                    if(a.id == b.id){
                        continue
                    }
                    b = this.contents[f]
                    
                    //console.log(`ax-bx = ${(a.x-b.x)**2}`)

                    //console.log(`b.x=${b.x} b.y=${b.y}`)
                    
                    //d = Math.sqrt( ((a.x - b.x)**2) + ((a.y - b.y)**2) )
                
                    //console.log(`Equation: ${d}=Math.sqrt( (${a.x}-${b.x})^2+(${a.y}-${b.y})^2  )`)
                    //this.contents[k].highlight( ctx, camera, viewport )
                
                }
            }
        }
    }
}