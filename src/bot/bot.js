import createGraph from 'ngraph.graph'
import { aStar } from 'ngraph.path'
import { Api } from '../api/api.js'
import { rnd } from '../math/math.js'
import { Log } from '../log/log.js'

export class Navigator {

  graph = createGraph()

  /** @type {ReturnType<typeof aStar>} */
  pathFinder

  /** @type {string[]} */
  planets = []

  /** @param {import('../api/api.js').Universe} universe */
  init(universe) {
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
    const nodes = this.pathFinder.find(from, to)
    const planets = nodes.map(node => node.id.toString()).reverse().filter(name => name !== from)
    return planets
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

}

export class Bot {
  api = new Api

  /** @type {import('../api/api.js').Player} */
  player

  navigator = new Navigator
  log = new Log(Date.now().toString(36))

  async tick() {
    this.player = await this.api.getPlayerUniverse()
    if (this.navigator.isInit() === false) {
      this.navigator.init(this.player.universe)
    }

    const target = this.navigator.getRandomPlanet([this.player.ship.planet.name])
    console.log(`Now go to "${target}"`)
    const path = this.navigator.findPath(this.player.ship.planet.name, target)
    console.log(`Path is: ${path.join(' -> ')}`)

    const planetData = await this.api.travelToPlanet({ planets: path })
    for (const fig of Object.values(planetData.planetGarbage)) {
      this.log.addToLog(fig)
    }

    console.log(`\n`)

    await (new Promise(r => setTimeout(r, 200)))
    return false
  }

  async loop() {
    console.log('BOT started')
    let stop = false
    while (stop !== true) {
      stop = await this.tick()
    }
  }
}

const obj = new Bot
obj.loop()