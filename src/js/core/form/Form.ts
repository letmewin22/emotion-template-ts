import {FormSend} from './FormSend'
import {Input} from './Input'
import {TOpts} from './TOpts'

export class Form {
  $form: HTMLFormElement
  $inputs: HTMLCollection

  constructor(readonly formSelector: string, readonly opts: TOpts) {
    this.$form = document.querySelector(formSelector)
    this.$inputs = this.$form.querySelectorAll('input')

    this.formSend = new FormSend(this.$form, this.opts)

    this.init()
  }

  private init(): void {
    this.$inputs.forEach($el => new Input($el))
    this.$form.addEventListener('submit', this.submit)
  }
}
