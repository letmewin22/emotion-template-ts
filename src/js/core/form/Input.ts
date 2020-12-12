import Bind from '@/utils/decorators/@Bind'
import {Validation} from './Validation/Validation'

export class Input {
  constructor(readonly $input: HTMLInputElement) {
    this.init()
  }

  private init(): void {
    this.$input.addEventListener('focus', this.focus)
    this.$input.addEventListener('blur', this.blur)
    this.$input.addEventListener('input', this.change)
  }

  @Bind
  change(e: Event): void {
    const t = e.target
    Input.validate(t)
  }

  @Bind
  focus(e: Event): void {
    e.preventDefault()
    const t = e.target
    t.focus()
    t.classList.add('js-focus')
    document.body.classList.add('e-fixed')
  }

  @Bind
  blur(e: Event): void {
    e.preventDefault()
    const t = e.target
    if (!t.value.trim().length) {
      t.blur()
      t.classList.remove('js-focus')
    }
    e.target.classList.remove('error')
    document.body.classList.remove('e-fixed')
  }

  static validate($el: HTMLInputElement): void {
    const validation = $el.dataset.validation

    if (validation) {
      const v = new Validation($el, validation)

      if (!v.init()) {
        $el.classList.add('error')
        return false
      }

      $el.classList.remove('error')
      return true
    }
  }
}
