import gsap from 'gsap'
import {state} from '../state'
import {clamp} from '@/utils/math'

type TEl = HTMLElement | Element | null

interface IEvent {
  [key: string]: any
}

interface IOptions {
  $el: TEl
  $scrollbar: HTMLElement
  $thumb: HTMLElement
  height: number
  max: number
}

export class ScrollbarDrag {
  events = {
    start: ['mousedown', 'touchstart'],
    move: ['mousemove', 'touchmove'],
    end: ['mouseup', 'touchend']
  }

  constructor(public options: IOptions) {
    this.bounds()
    this.init()
  }

  bounds(): void {
    const methods = ['start', 'update', 'end']
    methods.forEach(fn => (this[fn] = this[fn].bind(this)))
  }

  init(): void {
    this.events.start.forEach(name => {
      this.options.$scrollbar.addEventListener(name, this.start, {
        passive: false
      })
    })
    this.events.end.forEach(name => {
      this.options.$scrollbar.parentElement.addEventListener(name, this.end, {
        passive: false
      })
    })

    document.body.addEventListener('mouseleave', this.end)

    screen.width > 960 &&
      this.options.$scrollbar.addEventListener('click', this.update)
  }

  compute(o: number): void {
    const h = this.options.$scrollbar.offsetHeight
    state.scrollbar = true

    const target = clamp(this.options.height * (o / h), 0, this.options.max)

    gsap.to(state, {
      duration: 0.1,
      target,
      ease: 'none',
      overwrite: true,
      onComplete: () => {
        state.scrollbar = false
      }
    })
  }

  update(e: IEvent): void {
    let o: number
    if ('ontouchstart' in document.documentElement) {
      const b = e.target.getBoundingClientRect()
      o = e.targetTouches[0].pageY - b.top
    } else {
      o = e.clientY
    }
    this.compute(o)
  }

  start(): void {
    this.events.move.forEach(name => {
      this.options.$thumb.classList.add('active')
      this.options.$el.parentNode.addEventListener(name, this.update)
    })
  }

  end(): void {
    state.scrollbar = false
    this.options.$thumb.classList.remove('active')
    this.events.move.forEach(name => {
      this.options.$el.parentNode.removeEventListener(name, this.update)
    })
  }

  destroy(): void {
    this.events.start.forEach(name => {
      this.options.$scrollbar.removeEventListener(name, this.start)
    })
    this.events.end.forEach(name => {
      this.options.$scrollbar.parentElement.removeEventListener(name, this.end)
    })

    this.events.move.forEach(name => {
      this.options.$el.parentNode.removeEventListener(name, this.update)
    })

    document.body.removeEventListener('mouseleave', this.end)
    this.options.$scrollbar.removeEventListener('click', this.update)
  }
}

export type TScrollbarDrag = typeof ScrollbarDrag.prototype