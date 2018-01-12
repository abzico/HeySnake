import Tile from '../tile/tile'
import MathUtil from '../util/math-util'

let delay = 150 // duration in ms when snake should be moving to next tile
const kStartLength = 4 // starting length of snake, in tiles

const __ = {
  direction: {
    UP: 1,
    LEFT: 2,
    RIGHT: 3,
    DOWN: 4
  }
}

export default class Snake {
  constructor(tilemap) {
    // body is represented by tiles
    this._tiles = []
    this._tilemap = tilemap
    this._moveCountingTime = 0.0
    // when spawned, initially go to the right side
    this.direction = __.direction.RIGHT
    this.dead = false
    this.color = '#ffffff'

    this._initSnakeBody()
  }

  set color(val) {
    this._tiles.forEach((tile) => {
      tile.color = val
    })
  }

  _initSnakeBody() {
    // random starting position of snake on the map
    var startPosX = MathUtil.sharedInstance().randomInt(
      Math.floor(this._tilemap.tilemapWidth * 0.25),
      Math.floor(this._tilemap.tilemapWidth * 0.75)
    )
    var startPosY = MathUtil.sharedInstance().randomInt(
      Math.floor(this._tilemap.tilemapHeight * 0.25),
      Math.floor(this._tilemap.tilemapHeight * 0.75)
    )

    var tileWidth = this._tilemap.tileWidth
    var tileHeight = this._tilemap.tileHeight

    for (var i=0; i<kStartLength; i++) {
      // start snake's head at the right-end, then its body go to the left

      // bound x-location of tile
      var locX = startPosX - i
      if (locX < 0)
        locX += this._tilemap.tilemapWidth
      locX = locX % this._tilemap.tilemapWidth

      var pos = this._tilemap.getLocalPosFromTileLocation(locX , startPosY)
      var tile = new Tile(
        tileWidth - 2,
        tileHeight - 2,
        pos.posX,
        pos.posY,
        i == 0 ? '#ff0000' : this.color  // differentiate drawing head tile
      )
      // bound location
      var tileLoc = this._tilemap.getTileLocationFromLocalPos(tile.x, tile.y)
      this.boundTileLocation(tileLoc.x, tileLoc.y, tile)

      this._tiles.push(tile)
    }
  }

  _moveIntoDirection() {
    // get direction vector to move into
    var direction
    if (this.direction == __.direction.UP) direction = {x:0,y:-1}
    else if (this.direction == __.direction.LEFT) direction = {x:-1,y:0}
    else if (this.direction == __.direction.RIGHT) direction = {x:1,y:0}
    else direction = {x:0,y:1}

    var prevTilePos
    for (var i=0; i<this._tiles.length; i++) {
      var tile = this._tiles[i]
      
      // head tile moves into direction
      if (i == 0) {
        // save as prev tile pos
        prevTilePos = {x: tile.x, y: tile.y}

        var diffMove = {x: direction.x * this._tilemap.tileWidth, y: direction.y * this._tilemap.tileHeight}
        tile.x += diffMove.x
        tile.y += diffMove.y
      }
      // body-tile moves following its leading body-tile
      else {
        var oldPos = {x: tile.x, y: tile.y}
        tile.x = prevTilePos.x
        tile.y = prevTilePos.y

        // save as prev tile pos
        prevTilePos = {x: oldPos.x, y: oldPos.y}
      }

      // bound moved location
      var tileLoc = this._tilemap.getTileLocationFromLocalPos(tile.x, tile.y)
      this.boundTileLocation(tileLoc.x, tileLoc.y, tile)
    }
  }

  boundTileLocation(x, y, tile) {
    // bound x
    if (x < 0)
        x += this._tilemap.tilemapWidth
    x = x % this._tilemap.tilemapWidth

    // bound y
    if (y < 0)
      y += this._tilemap.tilemapHeight
    y = y % this._tilemap.tilemapHeight

    var pos = this._tilemap.getLocalPosFromTileLocation(x, y)
    tile.x = pos.posX
    tile.y = pos.posY
  }

  update(elapsedTime) {
    if (!this.dead) {
      this._moveCountingTime += elapsedTime
      if (this._moveCountingTime >= delay) {
        this._moveIntoDirection()

        this._moveCountingTime -= delay
      }
    }
  }

  drawToCanvas(ctx) {
    this._tiles.forEach((tile) => {
      tile.drawToCanvas(ctx)
    });
  }

  turnLeft() {
    if (this.direction == __.direction.RIGHT) {
      this.direction = __.direction.UP
    }
    else if (this.direction == __.direction.UP) {
      this.direction = __.direction.LEFT
    }
    else if(this.direction == __.direction.LEFT) {
      this.direction = __.direction.DOWN
    }
    else {
      this.direction = __.direction.RIGHT
    }
  }

  turnRight() {
    if (this.direction == __.direction.RIGHT) {
      this.direction = __.direction.DOWN
    }
    else if (this.direction == __.direction.UP) {
      this.direction = __.direction.RIGHT
    }
    else if(this.direction == __.direction.LEFT) {
      this.direction = __.direction.UP
    }
    else {
      this.direction = __.direction.LEFT
    }
  }
}