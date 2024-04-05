import { Vector2 } from 'three'

export class Vec2 extends Vector2 {

  /** @param {Vec2} point - находится ли точка в четырех смежных клетках */
  isNeighbor4(point) {
    return this.manhattanDistanceTo(point) === 1
  }

  /** @param {Vec2} point - находится ли точка в восьми смежных клетках */
  isNeighbor8(point) {
    const dx = Math.abs(this.x - point.x)
    const dy = Math.abs(this.y - point.y)

    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1) || (dx === 1 && dy === 1)
  }

}

/**
 * 
 * @param {number} from 
 * @param {number} to 
 * @returns {number}
 */
export function rnd(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from)
}