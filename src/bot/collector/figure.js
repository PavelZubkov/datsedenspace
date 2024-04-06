import { Vec2 } from '../../math/math.js'
import { Rewind } from '../../rewind/rewind.js';

export class Figure {
  /**
   * Создает экземпляр Rectangle.
   * @param {string} id Идентификатор фигуры.
   * @param {Array<Array<number>>} points Точки, описывающие форму фигуры.
   */
  constructor(id, points) {
    this.id = id;
    this.points = points;
    this.variating(true)
    /** @type {number} */
    this.size = points.length
  }

  getRaw() {
    return {
      [this.id]: this.points
    }
  }

  /**
   * Нормализует координаты точек фигуры.
   * @param {number[][]} points Точки для нормализации.
   * @returns {number[][]} Нормализованные точки.
   */
  normalize(points) {
    let minX = Math.min(...points.map(p => p[0]));
    let minY = Math.min(...points.map(p => p[1]));
    return points.map(p => [p[0] - minX, p[1] - minY]);
  }

  /** @type {Array<Array<Array<number>>>} */
  vars = [[],[],[],[]]

  /**
   * 
   * @param {boolean} run 
   */
  variating(run) {
    if (!run) return this.vars

    for (const point of this.points) {
      const [x, y] = point;
      // Первоначальное положение фигуры (0 градусов)
      this.vars[0].push([x, y]);
      // Вращение на 90 градусов по часовой стрелке
      this.vars[1].push([y, 3 - x]);
      // Вращение на 180 градусов по часовой стрелке (или на 90 градусов против часовой стрелки из положения на 90 градусов)
      this.vars[2].push([3 - x, 3 - y]);
      // Вращение на 270 градусов по часовой стрелке (или на 90 градусов против часовой стрелки из начального положения)
      this.vars[3].push([3 - y, x]);
    }

    this.vars[0] = this.normalize(this.vars[0])
    this.vars[1] = this.normalize(this.vars[1])
    this.vars[2] = this.normalize(this.vars[2])
    this.vars[3] = this.normalize(this.vars[3])

    const obj = {
      [this.hash(this.vars[0])]: this.vars[0],
      [this.hash(this.vars[1])]: this.vars[1],
      [this.hash(this.vars[2])]: this.vars[2],
      [this.hash(this.vars[3])]: this.vars[3],
    }

    const unique = [...new Set(Object.keys(obj))]

    this.vars = unique.map(key => obj[key])

    return this.vars
  }

  /**
   * 
   * @param {Vec2} pos
   * @param {number[][]} points
   */
  draw(pos, points) {
    // box
    const tl = pos.clone()
    const br = tl.clone().add(new Vec2(4, 4))
    Rewind.instance.rectangle(tl.x, tl.y, br.x, br.y, Rewind.DARK_GREEN, false)
    // points
    for (const [x, y] of points) {
      Rewind.instance.point(pos.clone().add(new Vec2(x, y)), Rewind.CRND(this.id))
    }
  }

  /**
   * @param {Vec2} pos
   */
  drawVars(pos) {
    const step = 5
    for (let i = 0; i < this.vars.length; i++) {
      const variant = this.vars[i]
      const position = pos.clone().add({ x: 0, y: pos.y + step * i })
      this.draw(position, variant)
    }
  }

  /** @param {number[][]} points */
  hash(points) {
    return points
      .map(([x, y]) => `${x},${y}`) // Преобразуем каждую точку в строку
      .sort() // Сортируем точки для получения консистентности
      .join(';'); // Объединяем все точки в одну строку
  }

  /**
   * @param {number[][]} variant
   */
  source(variant) {
    return {
      [this.id]: variant
    }
  }

  /**
   * 
   * @param {Figure[]} figures 
   * @param {Vec2} pos
   */
  static drawAll(pos, figures) {
    const copy = figures.slice()
    const sorted = copy.sort((a, b) => a.size - b.size)

    const step = 5

    let row = 0
    let col = 0
    for (let i = 0; i < sorted.length; i++) {
      const points = sorted[i].points
      const position = pos.clone().add({ x: pos.x + row, y: pos.y + col })
      sorted[i].draw(position, points)

      col += step
      if (col > 10) {
        col = 0
        row += step
      }
    }
  }
}

// const figure = [[0,0],[1,0],[2,0]]
// const figure = [[0,3],[0,2],[0,1],[0,0],[1,3],[1,0],[2,3],[2,0],[3,3],[3,2],[3,1]]
// const figure = [[0,0],[0,1], [1,0], [1,1]]
// const obj = new Figure('0', figure)

// console.log(obj.vars.map(obj.hash))

// console.log(obj.source(obj.vars[0]))

// obj.draw(new Vec2(0, 0), obj.vars[0])
// obj.draw(new Vec2(0, 5), obj.vars[1])
// obj.draw(new Vec2(0, 10), obj.vars[2])
// obj.draw(new Vec2(0, 15), obj.vars[3])

// obj.drawVars(new Vec2(10,0))

// Rewind.instance.endFrame()