import { figures } from '../bot/collector/testing/big_figures.js'

let min = Number.Infinity
let max = 0

for (const fig of figures) {
  console.log(fig.length)
  if (fig.length < min) min = fig.length
  if (fig.length > max) max = fig.length
}

console.log({ min, max })