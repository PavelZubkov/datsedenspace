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
 * @typedef {Object} Universe
 * @property {string[][]} universe
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
   * @returns {Promise<Player>}
   */
  async getPlayerUniverse() {
    const res = await axios.get(`${this.base}/player/universe`, { headers: this.headers() })
    return res.data
  }

  /**
   * @param {TravelRequest} request
   * @returns {Promise<TravelResponse>}
   */
  async travelToPlanet(request) {
    const res = await axios.post(`${this.base}/player/travel`, request, { headers: this.headers() })
    return res.data
  }

  /**
   * @param {CollectRequest} request
   * @returns {Promise<CollectResponse>}
   */
  async collectGarbage(request) {
    const res = await axios.post(`${this.base}/player/collect`, request, { headers: this.headers() })
    return res.data
  }

  /**
   * @returns {Promise<AcceptedResponse>}
   */
  async resetGame() {
    const res = await axios.delete(`${this.base}/player/reset`, { headers: this.headers() })
    return res.data
  }

  /**
   * @returns {Promise<RoundList>}
   */
  async getRounds() {
    const res = await axios.get(`${this.base}/player/rounds`, { headers: this.headers() })
    return res.data
  }
}
