import { Vec2, rnd } from "../../math/math.js"

export class Trash {

  /**
   * @param {Vec2} player
   * @param {Vec2} mapSize
   * @param {number} count
   * */
  constructor(mapSize, count, player) {
    /** @type {Set<`${number},${number}`>} */
    const coords = new Set()

    while (coords.size < count) {
      const x = rnd(0, mapSize.x)
      const y = rnd(0, mapSize.y)

      if (player.equals({ x, y })) continue

      coords.add(`${x},${y}`)
    }

    this.points = Array.from(coords).map(coord => {
      return new Vec2(...coord.split(',').map(Number))
    })

  }

  /** @type {Vec2[]} */
  points = []

  /** @param {Vec2} point */
  drop(point) {
    this.points = this.points.filter(v => !v.equals(point))
  }

  size() {
    return this.points.length
  }

  /** @param {Vec2} point */
  isPoint(point) {
    return this.points.some(v => v.equals(point))
  }

}
