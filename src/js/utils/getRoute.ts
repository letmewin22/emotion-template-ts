export const getRoute = (): string => {
  return document.querySelector('[data-router-view]').dataset.routerView
}
