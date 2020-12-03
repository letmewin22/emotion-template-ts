type Any = any
type PD = PropertyDescriptor

function Bind(_: Any, _2: Any, descriptor: PD): PD {
  const original = descriptor.value

  return {
    configurable: true,
    enumerable: false,
    get() {
      return original.bind(this)
    }
  }
}

export default Bind
