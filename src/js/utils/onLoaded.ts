import {raf} from '@emotionagency/utils'
import {state} from '../state'
import noop from './noop'

export const onLoaded = (cb = noop): void => {
  const detectLoading = (): void => {
    if (state.isLoaded) {
      cb()
      raf.off(detectLoading)
    }
  }

  raf.on(detectLoading)
}
