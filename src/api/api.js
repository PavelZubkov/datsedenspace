const { default: axios } = require("axios")
require("dotenv").config()

if (!process.env.TOKEN) throw new Error("Set TOKEN in .env")

export class Api {
  // base = 'https://datsedenspace.datsteam.dev'
  base = "http://localhost:5000";

  headers() {
    return {
      "X-API-Key": process.env.TOKEN,
    }
  }

  /**
   * 
   * @returns {Promise<{
   *  tick: number,
   *  playerPos: { x: number, y: number },
   *  map: number,
   * }>}
   */
  scan() {
    return axios.get(`${this.base}/scan`)
  }

  /**
   *
   * @param {{
   *  move: { x: number, y: number }
   * }} cmd
   * @returns
   */
  command(cmd) {
    return axios.post(`${this.base}/command`, cmd)
  }
}
