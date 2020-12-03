import Highway from '@dogstudio/highway'

export default class About extends Highway.Renderer {

  onEnterCompleted(): void {
    console.log('Hello from About')
  }
}
