class Rectangle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  contains(point) {
    return (point.x >= this.x - this.width &&
      point.x < this.x + this.width &&
      point.y >= this.y - this.height &&
      point.y < this.y + this.height);
  }

  intersects(range) {
    return !(range.x - range.width > this.x + this.width ||
      range.x + range.width < this.x - this.width ||
      range.y - range.height > this.y + this.height ||
      range.y + range.height < this.y - this.height);
  }
}

class QuadTree {
  constructor(boundary, capacity) {
    if (!boundary) throw TypeError('boundary is a mandatory param');
    if (!(boundary instanceof Rectangle)) throw TypeError('boundary should be a Rectangle');

    this.boundary = boundary;
    this.capacity = capacity || 4;
    this.gameObjects = [];
    this.divided = false;
  }

  insert(gameObject) {
    if (!this.boundary.contains(gameObject.position)) {
      return false; // object cannot be added to the quadtree
    }

    if (this.gameObjects.length < this.capacity) {
      this.gameObjects.push(gameObject);
      return true;
    }

    if (!this.divided) {
      this.subdivide();
    }

    return (this.northEast.insert(gameObject) || 
            this.northWest.insert(gameObject) || 
            this.southEast.insert(gameObject) || 
            this.southWest.insert(gameObject));
  }

  subdivide() {
    const { x, y, width, height } = this.boundary;
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    this.northEast = new QuadTree(new Rectangle(x + halfWidth, y - halfHeight, halfWidth, halfHeight), this.capacity);
    this.northWest = new QuadTree(new Rectangle(x - halfWidth, y - halfHeight, halfWidth, halfHeight), this.capacity);
    this.southEast = new QuadTree(new Rectangle(x + halfWidth, y + halfHeight, halfWidth, halfHeight), this.capacity);
    this.southWest = new QuadTree(new Rectangle(x - halfWidth, y + halfHeight, halfWidth, halfHeight), this.capacity);

    this.divided = true;
  }

  query(range, found) {
    if (!found) {
      found = [];
    }

    if (!range.intersects(this.boundary)) {
      return found; // empty list
    }

    for (let gameObject of this.gameObjects) {
      if (range.contains(gameObject.position)) {
        found.push(gameObject);
      }
    }

    if (this.divided) {
      this.northWest.query(range, found);
      this.northEast.query(range, found);
      this.southWest.query(range, found);
      this.southEast.query(range, found);
    }

    return found;
  }
}

class GameObject {
  constructor(x, y) {
    this.position = { x: x, y: y };
  }
}