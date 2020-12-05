import gsap from 'gsap'
import mutationObserver from '@/utils/mutationObserver'
import {state} from '@/state'
import {clamp} from '@/utils/math'
import {resize} from '@/utils/Resize'
import {raf} from '@/utils/RAF'
import {IScrollBar} from './IScrollbar'

export default class ScrollBar implements IScrollBar {

  scrollbar: HTMLElement
  private inactiveDelay: number
  private timer: number
  private elHeight: number
  private max: number
  private thumb: HTMLElement
  private height: number
  timerTicker: any
  interval: any
  private active: () => void

  constructor(readonly el?: HTMLElement | null) {
    this.el = el || document.getElementById('scroll-container')

    this.scrollbar = document.createElement('div')
    el
      ? this.scrollbar.classList.add('scrollbar', 'block-scrollbar')
      : this.scrollbar.classList.add('scrollbar')

    this.scrollbar.innerHTML = '<span class="scrollbar__thumb"></span>'

    this.inactiveDelay = 1
    this.timer = 0
    this.el && (this.elHeight = this.el.getBoundingClientRect().height)
    this.max = (this.elHeight - window.innerHeight) * -1

    this.active = () => {
      this.timer = 0
    }

    this.init()
  }

  init(): void {
    !this.el.parentNode.querySelector('.scrollbar') &&
      this.el.parentNode.appendChild(this.scrollbar)

    this.scrollbar.classList.remove('hidden')

    this.thumb = this.scrollbar.querySelector('.scrollbar__thumb')
    this.setHeight()

    resize.on(this.setHeight.bind(this))
    mutationObserver(this.el, this.setHeight.bind(this))

    this.detectInactivity()
    this.events()
  }

  setHeight(): void {
    const wh = window.innerHeight
    this.height = wh * (wh / this.el.scrollHeight)
    this.elHeight = this.el.getBoundingClientRect().height

    this.max = (this.elHeight - window.innerHeight) * -1
    if (this.el.scrollHeight === wh) this.height = 0

    this.thumb.style.height = this.height + 'px'
  }

  scroll(): void {
    if (state.scrolling) {
      const ch = document.documentElement.clientHeight

      this.thumb.classList.add('scrolling')
      const scrollPos = state.scrolled
      const percent = (100 * scrollPos) / (this.el.scrollHeight - ch)

      this.thumb.style.top = percent.toFixed(2) + '%'
      this.thumb.style.transform = `translateY(-${percent.toFixed(2)}%)`

      this.active()
    }
  }

  events(): void {
    const progressUpdate = (e: any) => {
      const h = this.scrollbar.offsetHeight
      let target : number
      let o : number

      state.scrollbar = true

      const changePos = (o : number) => {
        target = clamp(-this.el.scrollHeight * (o / h), 0, this.max)
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

      if ('ontouchstart' in document.documentElement) {
        const b = e.target.getBoundingClientRect()
        o = e.targetTouches[0].pageY - b.top
        changePos(o)
      } else {
        o = e.clientY
        changePos(o)
      }
    }

    const mousedown = () => {
      this.el.parentNode.addEventListener('mousemove', progressUpdate)
    }

    const touchstart = () => {
      this.el.parentNode.addEventListener('touchmove', progressUpdate)
      this.thumb.classList.add('active')
    }

    this.scrollbar.addEventListener('mousedown', mousedown)

    this.scrollbar.addEventListener('touchstart', touchstart, {
      passive: false
    })

    const mouseUp = () => {
      state.scrollbar = false
      this.el.parentNode.removeEventListener('mousemove', progressUpdate)
    }

    const touchend = () => {
      state.scrollbar = false
      this.thumb.classList.remove('active')
      this.el.parentNode.removeEventListener('touchmove', progressUpdate)
    }

    this.el.parentNode.addEventListener('mouseup', mouseUp)
    document.body.addEventListener('mouseleave', mouseUp)

    this.el.parentNode.addEventListener('touchend', touchend, {passive: false})

    screen.width > 960 &&
      this.scrollbar.addEventListener('click', progressUpdate)

    raf.on(this.scroll.bind(this))
  }

  controlsEvent(): void {
    if (this.timer >= this.inactiveDelay) {
      this.thumb.classList.remove('scrolling')
      return
    } else {
      this.thumb.classList.add('scrolling')
    }
  }

  detectInactivity(): void {
    this.timerTicker = setInterval(() => {
      this.timer++
    }, 1000)
    this.interval = setInterval(this.controlsEvent.bind(this), 120)

    this.scrollbar.addEventListener('mouseenter', this.active)
  }

  destroy(): void {
    document.querySelectorAll('.scrollbar').length > 0 &&
      document.querySelectorAll('.scrollbar').forEach(el => {
        el.classList.add('hidden')
        el.parentNode.removeChild(el)
      })
    raf.off(this.scroll.bind(this))
  }
}
