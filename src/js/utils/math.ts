export const lerp = (a: number, b: number, n: number): number => {
  return a * (1 - n) + b * n
}

export const clamp = (num: number, a: number, b: number): number => {
  return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b))
}
