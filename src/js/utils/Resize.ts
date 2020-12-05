type TFunc = () => void

class Resize {
  cbArray: Array<null | TFunc>
  debounced: TFunc
  constructor() {
    this.cbArray = []
    this.init()
  }

  bounds() {
    ['resizeHandler', 'debounce'].forEach(fn => {
      this[fn] = this[fn].bind(this)
    })
  }

  init() {
    this.bounds()
    this.debounced = this.debounce(this.resizeHandler, 60)
    window.addEventListener('resize', this.debounced)
  }

  resizeHandler() {
    this.cbArray.forEach(cb => cb())
  }

  on(cb: TFunc): void {
    cb()
    this.cbArray.push(cb)
  }

  off(cb: TFunc): void {
    this.cbArray = this.cbArray.filter(e => e !== cb)
  }

  debounce(func: TFunc, wait = 100): TFunc {
    let timeout
    return function(...args) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        func.apply(null, ...args)
      }, wait)
    }
  }

  destroy() {
    window.removeEventListener('resize', this.resizeHandler)
  }
}

const resizeInstance = new Resize()

export const resize = {
  on: (cb: TFunc): void => resizeInstance.on(cb),
  off: (cb: TFunc): void => resizeInstance.off(cb)
}
