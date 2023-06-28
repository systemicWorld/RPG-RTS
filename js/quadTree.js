/**
 * Represents a rectangle that hold references to intersecting rectangles.
 * @class
 */
class QuadTree {
    /**
     * Creates an instance of QuadTree.
     * @param {number} maxGenerations
     * @param {number} parent
     * @param {number} generation
     * @param {Object} boundary
     */
    constructor(maxGenerations = 1, 
                parent = null,
                generation = null,
                boundary) {
        this._maxGenerations = maxGenerations
        this._parent = parent
        this._generation = generation

        if (!boundary) throw TypeError('boundary is a mandatory param')
		if (!(boundary instanceof Rectangle)) throw TypeError('boundary should be a Rectangle')
		this._boundary = boundary

        this._children = []
        this._contents = []
    }
	// GETTERS
	get parent() { return this._parent }
	get children() { return this._children }
	get generation() { return this._generation }
    get maxGenerations() { return this._maxGenerations }
    get boundary() { return this._boundary }
    get contents() { return this._contents }
	// SETTERS
	set parent( newParent ) { this._parent = newParent }
	set children( newChildren ) { this._children = newChildren }
	set generation( int ) { this._generation = int }
    set maxGenerations( int ) { this._maxGenerations = int }
    set boundary( boundary ){ 
		if (!boundary) throw TypeError('boundary is a mandatory param')
		if (!(boundary instanceof Rectangle)) throw TypeError('boundary should be a Rectangle')
		this._boundary = boundary
	}
    set contents( array ) { this._contents = array }
	// METHODS
	addGeneration() {
		// console.info(`createNewGeneration()`)
    	if( this.children.length ) return console.warn(`Didn't create new generation! Quad already has ${this.children.length} children.`)
        if ( this.generation >= this.maxGenerations ) return console.warn(`Didn't create new gernation! Maximum generatations set to ${this.maxGenerations}.` )

        const { left, top, width, height } = this.boundary

        let generationNumber = 1 + this.generation
        let halfWidth = 0.5* width
        let halfHeight = 0.5* height
        let newQuad = {}

        for ( let i = 0; i < 2; i++ ){
            for ( let k = 0; k < 2; k++ ){
                newQuad = new QuadTree(this.maxGenerations,
                                       this,
                                       generationNumber,
                                       new Rectangle((k % 2 * halfWidth) + left, 
                                                     (i % 2 * halfHeight) + top,
                                                     halfWidth, 
                                                     halfHeight) ) 
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

        const { left, top, width, height } = this.boundary

        let generationNumber = 1 + this.generation
        let halfWidth = 0.5* width
        let halfHeight = 0.5* height
        let newQuad = {}

        for ( let i = 0; i < 2; i++ ){
            for ( let k = 0; k < 2; k++ ){
                newQuad = new QuadTree(this.maxGenerations,
                                       this,
                                       generationNumber,
                                       new Rectangle((k % 2 * halfWidth) + left, 
                                                     (i % 2 * halfHeight) + top,
                                                     halfWidth, 
                                                     halfHeight) ) 
                this.children.push( newQuad );

                if( depth > 1 ){ newQuad.addGenerations( depth-1 ) }
            }
        }
    }
    print(){
        console.info(`Quad info: Left:${this.left}, Top:${this.top}, Width:${this.width}, Height:${this.height}`)
    }
    draw( ctx, camera, viewport ){
        const { left, top, width, height } = this._boundary
        const { left: viewLeft, top: viewTop } = viewport.boundary
		const aR = viewport.aspectRatio
		ctx.beginPath()
		ctx.lineWidth = 1/ aR
		ctx.strokeStyle = "orange"
		ctx.rect(left+(-camera.left / aR) + viewLeft,
			     top+(-camera.top / aR) + viewTop, 
			     width / aR,
			     height / aR )
		ctx.stroke();
	}
    drawDeep( ctx, camera, viewport ){
        this.draw( ctx, camera, viewport )
        if ( this.children.length > 0 ){
            for( let i = 0; i < 4; i++ ){
                this.children[i].drawDeep( ctx, camera, viewport )
            }
        }
    }
    insert( agent ){
        //console.log('insert()')
        if( this.children.length ){
            // let quads = this.children
            //  0  1 quads
            //  2  3 quads
            for( let i = 0; i < 4; i++ ){
                if( this.children[i].boundary.intersects( agent.boundary ) ) {
                    this.children[i].insert( agent )
                }
            }
        } else {
            // console.log(`depth:${this.generation}`)
            this.contents.push( agent )
        }
    } 
   
    getInsertions( bounds, ins=[] ){
        // console.log(`getInsertions(), ${this.generation}`)
        if( this.children.length ){
            let quads = this.children
            const { x, y } = this.boundary.midpoint
            const { left: l, right: r, top: t, bottom: b } = bounds
            //  0  1
            //  2  3
            if( r < x && b < y ){
                ins.push( ...quads[0].getInsertions( bounds ) )
            } else if( l > x && b < y ){
                // console.log(`top right`)
                ins.push( ...quads[1].getInsertions( bounds ) )
            } else if( r < x && t > y ){
                // console.log(`bottom left`)
                ins.push( ...quads[2].getInsertions( bounds ) )
            } else if( l > x && t > y ){
                // console.log(`bottom right`)
                ins.push( ...quads[3].getInsertions( bounds ) )
            } else if( l < x && r > x && b < y ){
                // console.log(`t fold`)
                ins.push( ...quads[0].getInsertions( bounds ) )
                ins.push( ...quads[1].getInsertions( bounds ) )
            } else if(( l < x && r > x && t > y )) {
                // console.log(`b fold`)
                ins.push( ...quads[2].getInsertions( bounds ) )
                ins.push( ...quads[3].getInsertions( bounds ) )
            } else if( t < y && b > y && r < x ){
                // console.log(`l fold`)
                ins.push( ...quads[0].getInsertions( bounds ) )
                ins.push( ...quads[2].getInsertions( bounds ) )
            } else if( t < y && b > y && l > x ){
                // console.log(`r fold`)
                ins.push( ...quads[1].getInsertions( bounds ) )
                ins.push( ...quads[3].getInsertions( bounds ) )
            } else {
                // console.log(`center`)
                ins.push( ...quads[0].getInsertions( bounds ) )
                ins.push( ...quads[1].getInsertions( bounds ) )
                ins.push( ...quads[2].getInsertions( bounds ) )
                ins.push( ...quads[3].getInsertions( bounds ) )
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