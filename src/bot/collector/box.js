import { Vec2 } from "../../math/math.js"
import { Rewind } from "../../rewind/rewind.js"
import { Figure } from "./figure.js"

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Получить случайный индекс от 0 до i
    const j = Math.floor(Math.random() * (i + 1));
    // Поменять местами элементы с индексами i и j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
export class Box {
  /**
   *
   * @param {Vec2} [size]
   */
  constructor(size) {
    if (size) this.size = size
  }

  size = new Vec2(8, 11);

  box = Array.from({ length: 8 }, () => Array(11).fill(""));

  /** @type {Map<string, { figure: Figure, boxPoints: number[][] }>} */
  placed = new Map();

  getGarbagePlaced(boxed = true) {
    /** @type {Record<string, number[][]>} */
    const obj = {}
    for (const [id, figure] of this.placed.entries()) {
      obj[id] = boxed ? figure.boxPoints : figure.figure.points
    }
    return obj
  }

  getGarbagePlacedCount() {
    return this.placed.size
  }

  /**
   *
   * @param {Vec2} pos
   */
  draw(pos = new Vec2(0, 0)) {
    const EMPTY_COLOR = 0xFFFFFF
    const loading = this.loading()

    Rewind.instance.rectangle(pos.x, pos.y, pos.x + this.size.x, pos.y + this.size.y, 0x000000, false)

    for (let i = 0; i < this.box.length; i++) {
      for (let j = 0; j < this.box[i].length; j++) {
        const id = this.box[i][j]
        const color = id === "" ? EMPTY_COLOR : Rewind.CRND(id)
        Rewind.instance.point(pos.clone().add(new Vec2(i, j)), color, {
          id,
          x: i,
          y: j,
          loading,
        })
      }
    }
  }

  /**
   *
   * @param {Vec2} pos
   * @param {number[][]} points
   */
  putCheck(pos, points) {
    for (let i = 0; i < points.length; i++) {
      const x = points[i][0]
      const y = points[i][1]

      const boxX = x + pos.x
      const boxY = y + pos.y
      if (
        boxX < 0 ||
        boxX > this.size.x ||
        boxY < 0 ||
        boxY > this.size.y ||
        this.box[boxX][boxY] !== ""
      ) {
        return false
      }
    }

    return true
  }

  /**
   *
   * @param {Vec2} pos
   * @param {number[][]} points
   * @param {Figure} figure
   */
  put(pos, points, figure) {
    /** @type {number[][]} */
    const boxPoints = []

    for (let i = 0; i < points.length; i++) {
      const x = points[i][0]
      const y = points[i][1]

      const boxX = x + pos.x
      const boxY = y + pos.y
      boxPoints.push([boxX, boxY])
      this.box[boxX][boxY] = figure.id
    }

    this.placed.set(figure.id, { figure, boxPoints })
  }

  /**
   *
   * @param {Figure[]} figures
   */
  static putAllRndSort(figures) {
    const decrees = figures.slice().sort((a, b) => b.size - a.size)
    const increase = figures.slice().sort((a, b) => b.size - a.size)
    const random = [
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
      shuffleArray(figures.slice()),
    ]

    const boxes = [decrees, increase, ...random].map((figs, index) => {
      const box = new Box
      const leaved = box.putAll(figs)
      return { index, box, leaved }
    })

    const [winner] = boxes.sort((a,b) => b.box.loading() - a.box.loading())

    console.log(`collector: winner #${winner.index}`)

    return winner
  }

  /**
   *
   * @param {Figure[]} figures
   */
  putAll(figures) {
    // Сортировка фигур по убыванию их размера
    const sortedFigures = figures.slice().sort((a, b) => b.size - a.size)

    // const sortedFigures = []

    // Фигуры, которые не удалось поместить
    const leaved = []

    // Пробуем поместить каждую фигуру
    for (const figure of sortedFigures) {
      let placed = false // Флаг, поместили ли фигуру

      // Пробуем разместить каждую вариацию фигуры
      for (const variant of figure.vars) {
        for (let x = 0; x <= this.size.x - 4; x++) {
          for (let y = 0; y <= this.size.y - 4; y++) {
            const position = new Vec2(x, y)
            // Проверяем, можно ли разместить фигуру на текущем месте
            if (this.putCheck(position, variant)) {
              // Размещаем фигуру и выходим из цикла
              this.put(position, variant, figure)
              placed = true
              break
            }
          }
          if (placed) break
        }
        if (placed) break
      }

      // Если фигуру так и не удалось поместить, добавляем её в список неудач
      if (!placed) {
        leaved.push(figure)
      }
    }

    /** @type {Record<string, number[][]>} */
    const rawLeaved = {}
    for (const l of leaved) {
      rawLeaved[l.id] = l.points
    }
    return rawLeaved // Возвращаем фигуры, которые не удалось поместить
  }

  loading() {
    const total = this.size.x * this.size.y
    let loaded = 0
    for (const key of this.placed.keys()) {
      const obj = this.placed.get(key)
      loaded += obj?.figure?.size ?? 0
    }
    return Math.ceil(loaded / total * 100)
  }
}
