import { Api } from '../api/api.js'
import { Log } from '../log/log.js'
import { Vec2 } from '../math/math.js'
import { Rewind } from '../rewind/rewind.js'
import { Box } from './collector/box.js'
import { Figure } from './collector/figure.js'
import { Navigator } from './navigator.js'

export class Bot {
  api = new Api
  log = new Log(Date.now().toString(36))

  /** @type {import('../api/api.js').Player} */
  player

  navigator = new Navigator
  box = new Box()

  planetCurrent = ''

  /** @type {Map<string, boolean>} */
  planetCleared = new Map
  /** @type {Map<string, boolean>} */
  planetEmpty = new Map
  /** @type {Map<string, number>} */
  planetCount = new Map
  /** @type {Map<string, Record<string, number[][]>>} */
  planetGarbage = new Map

  /**
   * 
   * @param {string[]} path 
   */
  async travel(path) {
    if (!path.length) {
      console.log('travel: Empty PATH!')
      return
    }
    const planetName = path.at(-1) ?? ''
    const planetData = await this.api.travelToPlanet({ planets: path })
    const garbageCount = Object.keys(planetData.planetGarbage).length

    console.log(`travel: ${planetName} garbage=${garbageCount} ship=${this.box.getGarbagePlacedCount()}`)
    this.planetCurrent = planetName

    if (planetName === 'Eden') {
      this.box = new Box
    }

    if (this.box.getGarbagePlacedCount() > 0 && planetName !== 'Eden') {
      const placed = this.box.getGarbagePlaced(false)
      this.planetGarbage.set(planetName, { ...planetData.planetGarbage, ...placed })
    } else {
      this.planetGarbage.set(planetName, planetData.planetGarbage)
    }

    if (!garbageCount) {
      this.planetEmpty.set(planetName, true)
    }

    return garbageCount
  }

  async init() {
    this.player = await this.api.getPlayerUniverse()
    console.log('init:', JSON.stringify(this.player, null, 2))

    this.box = new Box(new Vec2(this.player.ship.capacityX, this.player.ship.capacityY))
    // init garbage

    this.planetCurrent = this.player.ship.planet.name

    if (this.navigator.isInit() === false) {
      this.navigator.init(this.player.universe)
    }

    this.planetEmpty.set('Earth', true)
    const pathToEden = this.navigator.findPath(this.planetCurrent, 'Eden')
    await this.travel(pathToEden)
  }

  async collect() {
    const garbageKnown = this.planetGarbage.get(this.planetCurrent)
    if (!garbageKnown) {
      console.log(`collect: planet "${this.planetCurrent}" not have garbage`)
      this.planetEmpty.set(this.planetCurrent, true)
      return false
    }
    if (Object.keys(garbageKnown).length === 0) {
      console.log('collect: IS EMTPY!!')
      this.planetEmpty.set(this.planetCurrent, true)
      return false
    }

    // const box = new Box
    // this.box = box
    const figures = Object.entries(garbageKnown).map(([id, points]) => new Figure(`${id}`, points))
    // const myLeaved = box.putAll(figures)

    const { box, leaved: myLeaved } = Box.putAllRndSort(figures)
    this.box = box

    Figure.drawAll(new Vec2(5, 0), figures)
    box.draw(new Vec2(0, 0))
    Rewind.instance.endFrame()

    console.log(`collect: Загружено ${box.loading()}%`)

    const collected = box.getGarbagePlaced()
    const { garbage, leaved, error } = await this.api.collectGarbage({ garbage: collected })

    if (error) {
      const neighbor = this.navigator.getNeighborPlanets(this.planetCurrent)
      for (const name of neighbor) {
        if (!this.planetCleared.get(name)) this.planetEmpty.set(name, true)
        // reset garbage?
      }
      console.log('collect: Загрузка провалилась - ' + error)
      return false
    }

    if (leaved?.length === 0) {
      this.planetCleared.set(this.planetCurrent, true)
      this.planetEmpty.set(this.planetCurrent, true)
      this.planetGarbage.set(this.planetCurrent, {})
      console.log('collect: Очищено!')
    } else {
      this.planetGarbage.set(this.planetCurrent, myLeaved)
      console.log(`collect: Осталось ${leaved.length} ${Object.keys(myLeaved).length}`)
    }

    return box.loading() > 40
  }

  async goToNext(needToEden = true) {
    if (needToEden) {
      const pathToEden = this.navigator.findPath(this.planetCurrent, 'Eden')
      await this.travel(pathToEden)
    }
    let randomFullyPlanet = this.navigator.getRandomPlanet(this.excludedPlanets())
    if (!randomFullyPlanet) {
      randomFullyPlanet = this.navigator.getRandomPlanet([])
    }
    const pathToRandomFullyPlanet = this.navigator.findPath(this.planetCurrent, randomFullyPlanet)
    await this.travel(pathToRandomFullyPlanet)
  }

  needToEdenInNextTick = false

  async tick() {
    console.log(`tick: start`)
    await this.goToNext(this.needToEdenInNextTick)
    this.needToEdenInNextTick = await this.collect()
    console.log(`tick: end\n`)

    return false
  }

  async loop() {
    console.log('BOT started')
    let stop = false

    await this.init()

    while (stop !== true) {
      stop = await this.tick()
    }
  }

  excludedPlanets(withCleared = true, withEmpty = true) {
    const names = []

    if (withCleared) {
      for (const [name, val] of this.planetCleared.entries()) {
        if (val === true) names.push(name)
      }
    }

    if (withEmpty) {
      for (const [name, val] of this.planetEmpty.entries()) {
        if (val === true) names.push(name)
      }
    }

    return names
  }
}
// for (const fig of Object.values(planetData.planetGarbage)) {
//   this.log.addToLog(fig)
// }

const obj = new Bot
obj.loop()