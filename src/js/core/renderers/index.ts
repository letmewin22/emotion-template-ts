export const home = (): Promise<any> => {
  return import(/* webpackChunkName: "home" */ './Home')
}

export const about = (): Promise<any> => {
  return import(/* webpackChunkName: "about" */ './About')
}
