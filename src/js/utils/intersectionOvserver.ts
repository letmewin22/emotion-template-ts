import noop from './noop'
import {raf} from './RAF'

type TIO = {
  on: () => void
  off: () => void
}

type TFunc = () => void

export const intersectionOvserver = (el: HTMLElement, cb: TFunc): TIO => {

  cb = cb ?? noop
  const b = el.getBoundingClientRect()

  if (b.top < window.innerHeight && -b.top <= b.height) {
    if (!el.classList.contains('js-in-view')) {
      el.classList.add('js-in-view')
      cb()
    }
  } else {
    el.classList.contains('js-in-view') && el.classList.remove('js-in-view')
  }

  return {
    on: () => raf.on(intersectionOvserver.bind(null, el, cb)),
    off: () => raf.off(intersectionOvserver.bind(null, el, cb))
  }
}
