import { Api } from '../api/api.js'
import { Rewind } from '../rewind/rewind.js'

export class Bot {
  api = new Api
  rewind = new Rewind

  async tick() {
    const gameState = await this.api.scan()

    if (gameState.isFinished) return true

    const cmd = {
      moveTo: { x: gameState.player.pos.x, y: gameState.player.pos.y },
    }

    await this.api.command(cmd)
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