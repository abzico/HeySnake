export default class Tile {
  constructor(width=0, height=0, x=0, y=0, color='#ffffff') {
    this.x = x
    this.y = y
    this.visible = true
    this.width = width
    this.height = height
    this.color = color
  }

  drawToCanvas(ctx) {
    if (!this.visible)
      return
    
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}