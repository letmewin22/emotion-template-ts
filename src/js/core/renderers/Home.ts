import Highway from '@dogstudio/highway'

class Home extends Highway.Renderer {
  onEnterCompleted(): void {
    console.log('Hello from Home')
  }
}
// Don`t forget to export your renderer
export default Home
