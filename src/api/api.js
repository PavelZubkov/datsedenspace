import axios from 'axios'
import { configDotenv } from 'dotenv'

configDotenv()
if (!process.env.TOKEN) throw new Error("Set TOKEN in .env")

/**
 * @typedef {Object} Error
 * @property {string} error
 */

/**
 * @typedef {Object} CollectRequest
 * @property {Object.<string, Array<Array<number>>>} garbage
 */

/**
 * @typedef {Object} TravelRequest
 * @property {string[]} planets
 */

/**
 * @typedef {Object} GarbageCoordinates
 * @property {Array<Array<number>>} coordinates
 */

/**
 * @typedef {Object} Planet
 * @property {Object.<string, Array<Array<number>>>} garbage
 * @property {string} name
 */

/**
 * @typedef {Object} Ship
 * @property {number} capacityX
 * @property {number} capacityY
 * @property {number} fuelUsed
 * @property {Object.<string, Array<Array<number>>>} garbage
 * @property {Planet} planet
 */

/**
 * @typedef {Array<[from: string, to: string, fuel: number]>} Universe
 */

/**
 * @typedef {Object} Player
 * @property {string} name
 * @property {Ship} ship
 * @property {Universe} universe
 */

/**
 * @typedef {Object} TravelResponse
 * @property {number} fuelDiff
 * @property {Object.<string, Array<Array<number>>>} planetGarbage
 * @property {Object.<string, Array<Array<number>>>} shipGarbage
 */

/**
 * @typedef {Object} CollectResponse
 * @property {Object.<string, Array<Array<number>>>} garbage
 * @property {string[]} leaved
 */

/**
 * @typedef {Object} Round
 * @property {string} startAt
 * @property {string} endAt
 * @property {boolean} isCurrent
 * @property {string} name
 * @property {number} planetCount
 */

/**
 * @typedef {Object} RoundList
 * @property {Round[]} rounds
 */

/**
 * @typedef {Object} AcceptedResponse
 * @property {boolean} success
 */

export class Api {
  constructor() {
    this.base = 'https://datsedenspace.datsteam.dev'
  }

  headers() {
    return {
      "X-Auth-Token": process.env.TOKEN,
    }
  }

  /**
   * @param {string} method 
   * @param {string} path 
   * @param {any} [data] 
   */
  async request(method, path, data) {
    /** @type {import('axios').AxiosResponse | null} */
    let response = null

    do {
      try {
        response = await axios({
          method,
          headers: this.headers(),
          url: `${this.base}/${path}`,
          data,
        })
      } catch(err) {
        if (axios.isAxiosError(err)) {
          console.error(`REQUEST ${path} ${err.response?.status} ${JSON.stringify(err.response?.data)}`)
          // Less Than Three
          await (new Promise(r => setTimeout(r, 500)))
        } else {
          console.error('=================== WARNING =======================')
          console.error(err)
        }
      }
    } while (response?.status !== 200)

    return response
  }

  /**
   * @returns {Promise<Player>}
   */
  async getPlayerUniverse() {
    const res = await this.request('get', 'player/universe')
    return res.data
  }

  /**
   * @param {TravelRequest} request
   * @returns {Promise<TravelResponse>}
   */
  async travelToPlanet(request) {
    const res = await this.request('post', 'player/travel', request)
    return res.data
  }

  /**
   * @param {CollectRequest} request
   * @returns {Promise<CollectResponse>}
   */
  async collectGarbage(request) {
    const res = await this.request('post', 'player/collect', request)
    return res.data
  }

  /**
   * @returns {Promise<AcceptedResponse>}
   */
  async resetGame() {
    const res = await this.request('delete', 'player/reset')
    return res.data
  }

  /**
   * @returns {Promise<RoundList>}
   */
  async getRounds() {
    const res = await this.request('get', 'player/rounds')
    return res.data
  }
}
