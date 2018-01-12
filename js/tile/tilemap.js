import Tile from './tile'

const kMetaExistenceName = "__meta_existence"

export default class Tilemap {
  constructor(tilemapWidth, tilemapHeight, tileWidth, tileHeight) {
    this.tilemapWidth= tilemapWidth
    this.tilemapHeight = tilemapHeight
    this.tileWidth = tileWidth
    this.tileHeight = tileHeight
    this._tiles = []
    this.bgColor = '#ffffff'
    this.x = 0
    this.y = 0

    this.visible = true

    this._constructTilemapsFromTiles()
  }

  set x(val) {
    // update all tiles
    this._tiles.forEach((tile, i) => {
      tile.x = val
    })
  }

  set y(val) {
    // update all tiles
    this._tiles.forEach((tile) => {
      tile.y = val
    })
  }

  set bgColor(color) {
    // update all tiles
    this._tiles.forEach((tile) => {
      tile.color = color
    })
  }

  _constructTilemapsFromTiles() {
    for (var j=0; j<this.tilemapHeight; j++) {
      for (var i=0; i<this.tilemapWidth; i++) {

        // create a new tile from properties of tilemap as a who`le
        var tile = new Tile(
          this.tileWidth, 
          this.tileHeight, 
          i*this.tileWidth, 
          j*this.tileHeight, 
          this.bgColor)
        this._tiles.push(tile)
      }
    }
  }

  drawAllTiles(ctx) {
    this._tiles.forEach((tile) => {
      tile.drawToCanvas(ctx)
    })
  }

  drawToCanvas(ctx) {
    if (!this.visible)
      return
    
    this.drawAllTiles(ctx)
  }

  /**
   * Convert from index-based location of tile-map to local position of Tilemap
   * 
   * (0,0) is at the top-left most
   * (N,N) is at the bottom-right most
   * @param {Number} x Tilemap's location at x (index-based)
   * @param {Number} y Tilemap's location at y (index-based)
   * @returns {Object} Return {posX, posY} which each element is the converted local position.
   */
  getLocalPosFromTileLocation(x, y) {
    return {
      posX: x * this.tileWidth,
      posY: y * this.tileHeight
    }
  }

  /**
   * Convert from local position of Tilemap to index-based location of tile-map
   * @param {Number} posX Local position x to convert
   * @param {Number} posY Local position y to convert
   * @returns {Object} Return {x, y} whose each element is index-based tilemap location
   */
  getTileLocationFromLocalPos(posX, posY) {
    return {
      x: Math.ceil(posX / this.tileWidth),
      y: Math.ceil(posY / this.tileHeight)
    }
  }
}