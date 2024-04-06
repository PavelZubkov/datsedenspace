import { Api } from '../api/api.js'
import { Log } from '../log/log.js'
import { Vec2 } from '../math/math.js'
import { Rewind } from '../rewind/rewind.js'
import { Box } from './collector/box.js'
import { Figure } from './collector/figure.js'
import { Navigator } from './navigator.js'

export class Bot {
  api = new Api 

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
   * @param {string} planet 
   * @param {boolean} [next] 
   */
  setPlanetCleared(planet, next) {
    if (next === undefined) {
      return this.planetCleared.get(planet)
    }

    this.planetCleared.set(planet, next)
    Log.saveJSON('planetCleared', [...this.planetCleared.entries()])

    return next
  }

  /**
   * 
   * @param {string} planet 
   * @param {boolean} [next] 
   */
  setPlanetEmpty(planet, next) {
    if (next === undefined) {
      return this.planetEmpty.get(planet)
    }

    this.planetEmpty.set(planet, next)
    Log.saveJSON('planetEmpty', [...this.planetEmpty.entries()])

    return next
  }

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
    const garbageCount = Object.keys(planetData?.planetGarbage ?? {}).length

    console.log(`travel: ${planetName} garbage=${garbageCount} ship=${this.box.getGarbagePlacedCount()}`)
    this.planetCurrent = planetName

    if (path.includes('Eden')) {
      this.box = new Box
    }

    if (!garbageCount) {
      this.setPlanetEmpty(planetName, true)
      this.planetGarbage.set(planetName, {})
    } else {
      this.planetGarbage.set(planetName, planetData.planetGarbage)
    }

    return garbageCount
  }

  isFinished() {
    return this.planetCleared.size === 98
  }

  async init() {
    this.planetCleared = new Map(Log.loadJSON('planetCleared') ?? [])
    this.planetEmpty = new Map(Log.loadJSON('planetEmpty') ?? [])

    this.player = await this.api.getPlayerUniverse()
    // console.log('init:', JSON.stringify(this.player, null, 2))

    this.box = new Box(new Vec2(this.player.ship.capacityX, this.player.ship.capacityY))
    // init garbage

    this.planetCurrent = this.player.ship.planet.name

    if (this.navigator.isInit() === false) {
      this.navigator.init(this.player.universe)
    }

    this.setPlanetEmpty('Earth', true)
    const pathToEden = this.navigator.findPath(this.planetCurrent, 'Eden')
    await this.travel(pathToEden)
  }

  async collect() {
    if (this.planetCurrent === 'Eden') {
      console.log(`collect: Не надо собирать мусор на Eden`)
      return false
    }

    const garbageKnown = this.planetGarbage.get(this.planetCurrent)

    if (!garbageKnown) {
      console.log(`collect: Нет мусора! Похоже мы потеряли информацию об этой планете`)
      this.setPlanetEmpty(this.planetCurrent, true)
      return false
    }

    if (Object.keys(garbageKnown).length === 0) {
      console.log('collect: Нет мусора! Наши данные не соответствовали действительности')
      this.setPlanetEmpty(this.planetCurrent, true)
      return false
    }

    if (this.box.getGarbagePlacedCount() > 0) {
      console.log(`collect: Учитываем мусор на корабле, загружено ${this.box.loading()}%`)
    }

    const shipGarbage = this.box.getGarbagePlaced(false)
    const totalGarbage = { ...garbageKnown, ...shipGarbage }
    const figures = Object.entries(totalGarbage).map(([id, points]) => new Figure(`${id}`, points))
    const { box, leaved: myLeaved } = Box.putAllRndSort(figures)

    if (this.box.getGarbagePlacedCount() > 0) {
      const diff = box.loading() - this.box.loading()
      console.log(`collet: Загрузка изменилась на ${diff}%. ${diff >= 6 ? ':)' : ':('}`)

      if (diff < 6) {
        return true
      }
    }

    this.box = box

    Figure.drawAll(new Vec2(5, 0), figures)
    box.draw(new Vec2(0, 0))
    Rewind.instance.endFrame()

    console.log(`collect: Загружено ${box.loading()}%`)

    const collected = box.getGarbagePlaced()
    const { garbage, leaved, error } = await this.api.collectGarbage({ garbage: collected })
    console.log(this.planetCurrent, leaved)

    if (error) {
      const neighbor = this.navigator.getNeighborPlanets(this.planetCurrent)
      for (const name of neighbor) {
        if (!this.planetCleared.get(name)) this.setPlanetEmpty(name, true) // this.planetEmpty.set(name, true)
        // reset garbage?
      }
      console.log('collect: Загрузка провалилась - ' + error)
      return false
    }

    if (leaved?.length === 0) {
      this.setPlanetCleared(this.planetCurrent, true)
      this.setPlanetEmpty(this.planetCurrent, true)
      this.planetGarbage.set(this.planetCurrent, {})
      console.log('collect: Очищено!')
    } else {
      this.planetGarbage.set(this.planetCurrent, myLeaved)
      console.log(`collect: Осталось ${leaved.length} ${Object.keys(myLeaved).length}`)
    }

    return box.loading() >= 75
  }

  async goToNext(needToEden = true) {
    if (needToEden) {
      const pathToEden = this.navigator.findPath(this.planetCurrent, 'Eden')
      await this.travel(pathToEden)
    }
    let randomFullyPlanet = 'Earth' // this.navigator.getRandomPlanet(this.excludedPlanets())
    const pathToRandomFullyPlanet = this.navigator.findPath(this.planetCurrent, randomFullyPlanet)
    return await this.travel(pathToRandomFullyPlanet)
  }

  needToEdenInNextTick = false

  async tick() {
    console.log(`tick: start ${new Date().toLocaleTimeString()}`)

    if (this.isFinished()) {
      console.log('DONEDONE')
      return true
    }

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