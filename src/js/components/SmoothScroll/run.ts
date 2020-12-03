import {state} from '@/state'

export const run = (el: HTMLElement, pos: number): void => {
  const t = `matrix3d(1, 0, 0, 0, 
      0, 1, 0, 0,
      0, 0, 1, 0, 
      0, ${pos}, 0, 1)`

  el.style.transform = t
  el.style.willChange = 'transform'
  state.scrolled = -pos
}
