import Highway from '@dogstudio/highway'

interface IHooks {
  H: typeof Highway | null
  useLoad: (cb: () => void) => void
  useNavigateIn: (cb: () => void) => void
  useNavigateEnd: (cb: () => void) => void
  useNavigateOut: (cb: () => void) => void
  useBoth: (cb: () => void) => void
  useBothStart: (cb: () => void) => void
}


export default class Hooks implements IHooks {

  H: typeof Highway
  constructor(H: typeof Highway) {
    this.H = H
  }

  useLoad(cb: () => void): void {
    window.addEventListener('load', () => {
      cb && cb()
    })
  }

  useNavigateIn(cb: () => void): void {
    this.H.on('NAVIGATE_IN', () => {
      cb && cb()
    })
  }

  useNavigateEnd(cb: () => void): void {
    this.H.on('NAVIGATE_END', () => {
      cb && cb()
    })
  }

  useNavigateOut(cb: () => void): void {
    this.H.on('NAVIGATE_OUT', () => {
      cb && cb()
    })
  }

  useBoth(cb: () => void): void {
    this.useLoad(cb)
    this.useNavigateEnd(cb)
  }

  useBothStart(cb: () => void): void {
    this.useLoad(cb)
    this.useNavigateIn(cb)
  }
}
