import axios from 'axios'
import { configDotenv } from 'dotenv';
import { Game } from '../game/game.js'

configDotenv()
if (!process.env.TOKEN) throw new Error("Set TOKEN in .env")

export class Api {
  // base = 'https://datsedenspace.datsteam.dev'
  base = "http://localhost:3000/api";

  headers() {
    return {
      "X-API-Key": process.env.TOKEN,
    }
  }

  /** @returns {Promise<ReturnType<Game['state']>>} */
  async scan() {
    const res = await axios.get(`${this.base}/scan`)
    return res.data
  }

  /**
   * @param {Parameters<Game['update']>[0]} cmd
   * @returns {Promise<{ error: string | null }>}
   */
  async command(cmd) {
    const res = await axios.post(`${this.base}/command`, cmd)
    return res.data
  }
}
