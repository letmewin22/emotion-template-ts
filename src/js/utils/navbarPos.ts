import {state} from '@/components/SmoothScroll/state'
import {isFixed} from './isFixed'
import {raf} from '@emotionagency/utils'

export default class NavbarPos {
  mouseFunc: (e: any) => any
  scrollPos: number

  constructor() {
    this.mouseFunc = (e: any) => {
      this.mouseHandler(e)
    }
  }

  init(): void {
    this.scrollPos = 0
    raf.on(this.scrollNav.bind(this))
  }

  mouseHandler(e: MouseEvent): void {
    if (e.screenY <= document.querySelector('.navbar').scrollHeight + 100) {
      document.body.classList.remove('nav-hidden')
    } else document.body.classList.add('nav-hidden')
  }

  scrollNav(): void {
    // const b = document.getElementById('scroller').getBoundingClientRect()
    const b = {
      top: -state.scrolled
    }
    if (b.top > this.scrollPos || isFixed()) {
      document.body.classList.remove('nav-hidden')
      document.removeEventListener('mousemove', this.mouseFunc)
    } else if (b.top < this.scrollPos && this.scrollPos <= 0) {
      document.body.classList.add('nav-hidden')
      document.querySelector('.navbar').classList.remove('remove-bg')

      document.addEventListener('mousemove', this.mouseFunc)
    } else if (this.scrollPos === 0) {
      document.querySelector('.navbar').classList.add('remove-bg')
    }

    // this.scrollPos = document
    //   .getElementById('scroller')
    //   .getBoundingClientRect().top
    this.scrollPos = -state.scrolled
  }

  destroy(): void {
    this.scrollPos = 0
    raf.off(this.scrollNav.bind(this))
  }
}
