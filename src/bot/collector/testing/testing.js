import { Vec2 } from '../../../math/math.js'
import { Rewind } from '../../../rewind/rewind.js'
import { Box } from '../box.js'
import { Figure } from '../figure.js'
import { points } from './big_figures.js'

let count = 0
let avgLoadedPercent = 0

const step = 40

for (let i = 0; i < points.length; i+=step) {
  const garbage = points.slice(i, i+step)
  const figures = Object.entries(garbage).map(([id, points]) => new Figure(`${id}`, points))
  Figure.drawAll(new Vec2(5, 0), figures)

  // const box = new Box()
  // const leaved = box.putAll(figures)

  const { box, leaved } = Box.putAllRndSort(figures)

  box.draw(new Vec2(0, 0))

  count += 1
  avgLoadedPercent += box.loading()

  const msg = {
    i,
    totalSize: figures.reduce((total, fig) => total + fig.size, 0),
    loadedSize: [...box.placed.values()].reduce((total, obj) => total + obj.figure.size, 0),
    leavedCount: leaved.length,
    loadedPercent: leaved.length === 0 ? 100 : box.loading(),
  }

  Rewind.instance.message(JSON.stringify(msg, null, 2))

  console.log(msg)

  Rewind.instance.endFrame()
}

console.log('Средняя загрузка', Math.ceil(avgLoadedPercent / count))


