import createGraph from 'ngraph.graph'
import { aStar } from 'ngraph.path'
import { rnd } from '../math/math.js'

export class Navigator {

  graph = createGraph()

  Eden = 'Eden'

  /** @type {ReturnType<typeof aStar>} */
  pathFinder

  /** @type {string[]} */
  planets = []

  /** @type {import('../api/api.js').Universe} universe */
  universe = []

  getNeighborPlanets(name = '') {
    const list = []
    for (const [from, to] of this.universe) {
      if (from === name) list.push(to)
    }
    return list
  }

  /** @param {import('../api/api.js').Universe} universe */
  init(universe) {
    this.universe = universe

    const allPlanets = new Set

    for (const [from, to, fuel] of universe) {
      allPlanets.add(from)
      allPlanets.add(to)

      this.graph.addLink(from, to, { weight: fuel })
    }

    allPlanets.delete('Eden')
    this.planets = [...allPlanets.values()]

    this.pathFinder = aStar(this.graph, {
      oriented: true,
      distance(fromNode, toNode, link) {
        return link.data.weight
      }
    })
  }

  isInit() {
    return !!this.pathFinder
  }

  /**
   * @param {string} from 
   * @param {string} to 
   * @returns {any}
   */
  findPath(from, to) {
    try {
      const nodes = this.pathFinder.find(from, to)
      const planets = nodes.map(node => node.id.toString()).reverse().filter(name => name !== from)
      return planets
    } catch(err) {
      console.log({ from, to })
      throw err
    }
  }

  /**
   * 
   * @param {string[]} excludes 
   */
  getRandomPlanet(excludes = []) {
    const filter = this.planets.filter(name => !excludes.includes(name))
    const index = rnd(0, filter.length - 1)
    const planet = filter[index]
    return planet
  }

  /**
   * 
   * @param {string} path 
   */
  increaseWeights(path) {
    for (let i = 0; i < path.length; i++) {
      const fromId = path
    }
    this.graph.forEachLink(link => {
    })
  }

}