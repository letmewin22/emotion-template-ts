type TState = {
  isLoaded: boolean
  scrolling?: boolean
  scrolled?: number
  scrollbar?: boolean
  target?: number
}

export const state: TState = {
  isLoaded: false
}
