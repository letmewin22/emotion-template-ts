import '@/libs/ie-detect'
import '@/libs/sayHello'
import cssWebP from '@/libs/testWebP'
import moveEl from '@/libs/moveEl'

import Hooks from '@core/Hooks'
import {state} from '@/state'

import bgWebP from '@/utils/bgWebP'
import {resize} from '@emotionagency/utils'
import {winH} from '@/utils/winH'

export const render = <T>(H: T): void => {
  process.env.NODE_ENV === 'production' && cssWebP()

  const hooks = new Hooks(H)

  hooks.useNavigateOut(() => {
    state.isLoaded = false
  })

  hooks.useNavigateEnd(() => {
    state.isLoaded = true
  })

  let smoothScroll

  hooks.useBothStart(() => {
    bgWebP()
    moveEl()

    smoothScroll && smoothScroll.reset()
  })

  hooks.useLoad(async() => {
    resize.on(winH)

    // const navbarPos = new NavbarPos()
    // navbarPos.init()

    const {SmoothScroll} = await import(
      /* webpackChunkName: "smoothscroll" */
      '@emotionagency/smoothscroll'
    )
    smoothScroll = new SmoothScroll()
  })

  const links = document.querySelectorAll('nav a')

  hooks.useBoth(async() => {
    const {default: Form} = await import(
      /* webpackChunkName: "form" */
      '@emotionagency/form'
    )

    const form = new Form('#form', {
      URL: 'http://localhost:8080/api/mail.php'
    })
    form.addFocus(0)

    links.forEach((link: HTMLLinkElement) => {
      link.classList.remove('is-active')
      link.href === location.href && link.classList.add('is-active')
    })
  })
}
