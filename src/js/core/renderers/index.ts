export const home = (): Promise<any> => {
  return import(/* webpackChunkName: "home" */ './Home')
}
