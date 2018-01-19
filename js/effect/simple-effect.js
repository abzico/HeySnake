import glEffectUtil from './gleffect-util'

var vertexShaderSource = `attribute vec2 a_position;
uniform vec2 u_resolution;

void main() {
  vec2 clipspace = a_position / u_resolution * 2.0 - 1.0;

  gl_PointSize = 1.0;
  gl_Position = vec4(clipspace * vec2(1,-1), 0, 1);
}`;

var fragmentShaderSource = `precision mediump float;

void main() {
  gl_FragColor = vec4(1, 0, 0, 1);
}`;

export default class SimpleEffect {
  constructor(gl) {
    this.rttFramebuffer = null
    this.rttTexture = null

    var vertexShader = glEffectUtil.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    var fragmentShader = glEffectUtil.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    var program = glEffectUtil.createProgram(gl, vertexShader, fragmentShader)

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position")
    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution")
    var positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    // three 2d points
    var positions = [
      10, 20,
      80, 20,
      10, 30,
      10, 30,
      80, 20,
      80, 30,
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    this.program = program
    this.positionAttributeLocation = positionAttributeLocation
    this.positionBuffer = positionBuffer
    this.resolutionUniformLocation = resolutionUniformLocation

    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }

  drawToCanvas(gl) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clearColor(0,0,0,0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // tell to use our program (pair of shaders)
    gl.useProgram(this.program)

    gl.uniform2f(this.resolutionUniformLocation, gl.canvas.width, gl.canvas.height)
    gl.enableVertexAttribArray(this.positionAttributeLocation)
    // bind position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
    // tell the attribute how to get data out of position buffer
    var size = 2
    var type = gl.FLOAT
    var normalize = false
    var stride = 0
    var offset = 0
    gl.vertexAttribPointer(this.positionAttributeLocation, size, type, normalize, stride, offset)

    // execute GLSL program
    var primitiveType = gl.TRIANGLES
    var offset = 0
    var count = 6
    gl.drawArrays(primitiveType, offset, count)

    // reset bound resource
    gl.disableVertexAttribArray(this.positionAttributeLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }
}