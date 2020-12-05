export const home = (): Promise => {
  return import(/* webpackChunkName: "home" */ './Home')
}

export const about = (): Promise => {
  return import(/* webpackChunkName: "about" */ './About')
}
