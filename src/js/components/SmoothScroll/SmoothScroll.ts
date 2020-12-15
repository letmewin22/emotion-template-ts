import VirtualScroll from 'virtual-scroll'

import {state} from '@/state'
import {clamp, lerp} from '@/utils/math'
import ScrollBar from './Scrollbar/ScrollBar'
import {run} from './run'
import {resize} from '@/utils/Resize'
import mutationObserver from '@/utils/mutationObserver'
import {raf} from '@/utils/RAF'
import {isFixed} from '@/utils/isFixed'

type TOpts = {
  touchMultiplier: number
  firefoxMultiplier: number
  preventTouch: boolean
  el: HTMLElement | null
}

export default class SmoothScroll {
  $el: HTMLElement | null
  targetY: number
  currentY: number
  ease: number
  opts: TOpts
  height: number
  max: number

  constructor($el: string) {
    this.$el = document.querySelector($el)
    this.targetY = 0
    this.currentY = 0
    this.ease = 0.08

    this.opts = {
      touchMultiplier: 3.8,
      firefoxMultiplier: 40,
      preventTouch: true,
      el: document.querySelector('#scroll-container')
    }

    this.init()
  }

  bounds(): void {
    const methods = ['scroll', 'resize']
    methods.forEach(fn => (this[fn] = this[fn].bind(this)))
  }

  virtualScroll(): void {
    const vs = new VirtualScroll(this.opts)

    vs.on((e: WheelEvent) => {
      if (!isFixed()) {
        if (state.target === undefined) {
          this.targetY += e.deltaY
          state.target = e.deltaY
        } else {
          state.target += e.deltaY
          state.target = clamp(state.target, 0, this.max)
          this.targetY = state.target
        }
      }
    })
  }

  init(): void {
    this.bounds()
    this.virtualScroll()
    resize.on(this.resize)
    mutationObserver(this.$el, this.resize)

    new ScrollBar()
    raf.on(this.scroll)
  }

  scroll(): void {
    const s = state.scrollbar
    const dif = Math.abs(Math.round(this.targetY) - Math.round(this.currentY))
    if (dif >= 1 || s) {
      state.scrolling = true
    } else {
      state.scrolling = false
    }

    if (state.scrolling) {
      this.targetY = state.target
      this.currentY = lerp(this.currentY, this.targetY, this.ease)
      this.currentY = Math.round(this.currentY * 100) / 100
      run(this.$el, this.currentY)
    }
  }

  resize(): void {
    this.height = this.$el.getBoundingClientRect().height
    this.max = (this.height - window.innerHeight) * -1
  }

  reset(): void {
    state.target = 0
    this.targetY = 0
    this.currentY = 0
    run(this.$el, 0)
  }

  // destroy(): void {}
}

export type TSmoothScroll = typeof SmoothScroll.prototype
