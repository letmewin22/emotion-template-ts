import Bind from '@/utils/decorators/@Bind'
import {parsePhoneNumberFromString} from 'libphonenumber-js'

type TFunc = () => void

export class Validation {
  constructor(readonly $input: HTMLInputElement, readonly options: string) {}

  init(): TFunc {
    const optionsValues = this.options.split(' ')

    const result = optionsValues.map(option => {
      const method = option.replace(/[\d()]/gm, '')
      const values = option.replace(/\D/gm, '')
      return this[method](this.$input, +values)
    })

    return !result.includes(false)
  }

  @Bind
  phone($input: HTMLInputElement): boolean {
    $input.value = $input.value.replace(
      /[A-z]|[А-я]|\s|[*!@#$%^&{}[\]~""/|=]/g,
      ''
    )
    const phoneNumber = parsePhoneNumberFromString($input.value)
    if (phoneNumber) {
      $input.value = phoneNumber.formatInternational()
    }

    return true
  }

  @Bind
  minlength($input: HTMLInputElement, value: number): boolean {
    if ($input.value.trim().length < value) {
      return false
    }
    return true
  }

  email($input: HTMLInputElement): boolean {
    const regExp = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/
    const isEmailValid = regExp.test($input.value.trim())
    if (!isEmailValid) {
      return false
    }
    return true
  }

  maxlength($input: HTMLInputElement, value: number): boolean {
    if ($input.value.trim().length > value) {
      return false
    }
    return true
  }
}
