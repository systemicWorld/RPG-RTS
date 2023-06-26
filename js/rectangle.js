/**
 * Represents a rectangle great for bounding.
 * @class
 */
class Rectangle {
  /**
   * Creates an instance of Rectangle.
   * @param {number} left
   * @param {number} top
   * @param {number} width
   * @param {number} height
   * @param {number} right
   * @param {number} bottom
   */
  constructor(left = null,
              top = null,
              width = null,
              height = null,
              right = null,
              bottom = null) {
    this._left = left
    this._top = top
    this._width = width
    this._height = height
    this._right = right
    this._bottom = bottom

    left === null ? this._left = right - width : this._left = left
    top === null ? this._top = bottom - height : this._top = top
    width === null ? this._width = right - left : this._width = width
    height === null ? this._height = bottom - top : this._height = height
    right === null ? this._right = left + width : this._right = right
    bottom === null ? this._bottom = top + height : this._bottom = bottom

    this._midpoint = { x: this._left+(0.5*this._width),
                       y: this._top+(0.5*this._height)}
  }
  // GETTERS
  get left() { return this._left }
  get top() { return this._top }
  get width() { return this._width }
  get height() { return this._height }
  get right() { return this._right }
  get bottom() { return this._bottom }
  get midpoint() { return this._midpoint }
	// SETTERS
  set left( number ) { 
    this._left = number
    this._right = this._left + this._width 
    this._midpoint.x = this._left+(0.5*this._width) }
  set top( number ){ 
    this._top = number
    this._bottom = this._top + this._height
    this._midpoint.y = this._top+(0.5*this._height) }
  set width( number ) {
    this._width = number
    this._right = this._left + this._width
    this._midpoint.x= this._left+(0.5*this._width) }
  set height( number ) {
    this._height = number
    this._bottom = this._top + this._height
    this._midpoint.y = this._top+(0.5*this._height) } 

  contains(point) {
    return (point.x >= this._left &&
            point.x < this._right &&
            point.y >= this._top &&
            point.y < this._bottom)
  }

  intersects(rect) {
    // Extract rectangle edges
    const { _left: left1, _right: right1, _top: top1, _bottom: bottom1 } = this
    const { _left: left2, _right: right2, _top: top2, _bottom: bottom2 } = rect

    return !(right1 < left2 || 
          left1 > right2 ||
          bottom1 < top2 || 
          top1 > bottom2)
  }
}