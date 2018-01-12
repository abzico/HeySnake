let instance = null

export default class MathUtil {
  constructor() {
  }

  static sharedInstance() {
    if (!instance)
      instance = new MathUtil()
    
    return instance
  }

  /**
   * Random integer number with [min, max)
   * @param {number} min Mininum number to include in randomize
   * @param {number} max Maximum exclusive number to include in randomize
   */
  randomInt(min, max) {
    min = Math.ceil(min)
    max = Math.ceil(max)
    return Math.floor(Math.random() * (max - min)) + min
  }
}