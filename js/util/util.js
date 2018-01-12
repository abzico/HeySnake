let instance = null

export default class Util {
  constructor() {
    if (!instance)
      instance = this
    
    return instance
  }
}