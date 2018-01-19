import Music      from './runtime/music'

import Tile from './tile/tile'
import Tilemap from './tile/tilemap'
import Snake from './object/snake'
import SimpleEffect from './effect/simple-effect'

let ctx   = canvas.getContext('2d')
let effectCanvas = wx.createCanvas()
let effectCanvasCtx = null; // effectCanvas.getContext('webgl') // disable webgl effect, not worth it
let isWebGLAvailable = false
if (effectCanvasCtx && false) {   // disable webgl effect
  isWebGLAvailable = true
  console.log('webgl is available')
}

// off-screen canvas
let mapCanvas = wx.createCanvas()
let mapCtx = mapCanvas.getContext('2d')

let kTileMapSize = 20
let kTileSize = 12

let startTime = null
let prevTime = null

let isShow = true

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.restart()
  }

  restart() {
    // remove any existing touch handler
    if (this.touchHandler) {
      canvas.removeEventListener(
        'touchstart',
        this.touchHandler
      )
    }
    // register touch handler
    this.touchHandler = this.touchEventHandler.bind(this)
      canvas.addEventListener('touchstart', this.touchHandler)

    // initialize varaibles
    this.tilemap = new Tilemap(kTileMapSize, kTileMapSize, kTileSize, kTileSize)
    this.tilemap.bgColor = '#333333'
    this.mapScale = 1.0
    this.mapOffsetY = window.innerHeight/2.0 - this.tilemap.tilemapHeight*this.tilemap.tilemapHeight/2.0
    this.scaleTilemapAsFixedWidth()

    this.snake = new Snake(this.tilemap)
    this.foods = []
    if (isWebGLAvailable) {
      this.simpleEffect = new SimpleEffect(effectCanvasCtx)
    }

    // request animation frame update
    window.requestAnimationFrame(
      this.loop.bind(this),
      canvas
    )

    this.hookUpWithAppLifeCycle()
  }

  hookUpWithAppLifeCycle() {
    wx.onHide(() => {
      isShow = false
      startTime = null
      console.log('onHide called')
    })
    wx.onShow(() => {
      isShow = true
      console.log('onShow called')
    })
  }

  spawnANewFood() {
    
  }

  scaleTilemapAsFixedWidth() {
    var designWidth = kTileMapSize * kTileSize
    this.mapScale = window.innerWidth / designWidth
    mapCtx.scale(this.mapScale, this.mapScale)
  }

  touchEventHandler(e) {
     e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    // turn left
    if (x < window.innerWidth/2.0) {
      this.snake.turnLeft()
    }
    // turn right
    else if (x > window.innerWidth/2.0) {
      this.snake.turnRight()
    }
  }

  renderBackground() {
    ctx.fillStyle = '#F8F8F8'
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
    ctx.restore()
  }

  renderShadowBelowMap() {
    ctx.shadowColor = "rgba(0,0,0,0.15)"
    ctx.shadowBlur = 4
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 2
    ctx.fillRect(
      0, 
      this.mapOffsetY, 
      this.tilemap.tilemapWidth * this.tilemap.tileWidth, 
      this.tilemapHeight * this.tilemap.tileHeight)
    ctx.restore()
  }

  update(elapsedTime) {
    if (!isShow)
      return

    this.snake.update(elapsedTime)
  }

  render() {
    if (!isShow)
      return

    // color background
    this.renderBackground()
    // add shadow below map
    this.renderShadowBelowMap()

    // draw our stuff into off-screen map context
    this.tilemap.drawToCanvas(mapCtx)
    this.snake.drawToCanvas(mapCtx)

    // blit into final on-screen canvas context
    ctx.drawImage(mapCanvas, 0, this.mapOffsetY)

    // effect
    if (isWebGLAvailable) {
      this.simpleEffect.drawToCanvas(effectCanvasCtx)
      ctx.drawImage(effectCanvas, 0, 0)
    }
  }

  loop(currentTime) {
    if (!isShow)
      return

    var elapsedTime = 0

    if (startTime == null) {
      startTime = currentTime
      prevTime = currentTime
    }
    else {
      // calculate elapsed time
      elapsedTime = currentTime - prevTime
      prevTime = currentTime
    }

    this.update(elapsedTime)
    this.render()

    // loop this again
    window.requestAnimationFrame(
      this.loop.bind(this),
      canvas
    )
  }
}
