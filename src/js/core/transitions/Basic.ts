import Highway from '@dogstudio/highway'

type T = {
  from?: HTMLElement
  done?: () => void
  to?: HTMLElement
  trigger?: HTMLElement
}

class Basic extends Highway.Transition {
  in({from, done}:T): void {
    window.scrollTo(0, 0)
    // Remove Old View
    from.remove()
    done()
  }

  out({done}:T): void {
    done()
  }
}

export default Basic
