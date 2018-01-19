module.exports = {
  /**
   * Create shader and compile it from input source.
   * @param {WebGLRenderingContext} gl WebGL context
   * @param {*} type Type of shader
   * @param {string} source Input source string
   * @returns newly created and compiled WebGLShader instance
   */
  createShader(gl, type, source) {
    var shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (success) {
      return shader;
    }

    console.log(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
  },

  /**
   * Link shader program
   * @param {WebGLRenderingContext} gl WebGL Context
   * @param {WebGLShader} vertexShader Vertex shader
   * @param {WebGLShader} fragmentShader Fragment shader
   */
  createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    var success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (success) {
      return program
    }

    console.log(gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
  }
}