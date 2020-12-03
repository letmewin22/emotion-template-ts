export const winH = (): void => {
  const vh = window.innerHeight
  document.body.style.setProperty('--vh', `${vh}px`)
}
