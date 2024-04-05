import { Server } from "../server/server.js"
import { Vec2, rnd } from "../math/math.js"
import { Trash } from "./trash/trash.js"

export class Game {

  server = new Server({
    '/api/scan': {
      'GET': this.onScan.bind(this),
    },
    '/api/command': {
      'POST': this.onCommand.bind(this),
    }
  })

  // constants
  MAP_SIZE = new Vec2(1000, 1000)
  TICK_TOTAL = 10_000
  TRASH_COUNT = 100

  // game state
  tick = 0
  player = {
    pos: new Vec2(rnd(0, this.MAP_SIZE.x), rnd(0, this.MAP_SIZE.y)),
    score: 0,
  }
  trash = new Trash(this.MAP_SIZE, this.TRASH_COUNT, this.player.pos)

  isFinished() {
    return this.tick >= this.TICK_TOTAL || this.trash.size() <= 0
  }

  state() {
    return {
      tick: this.tick,
      tickTotal: this.TICK_TOTAL,
      player: {
        score: this.player.score,
        pos: { x: this.player.pos.x, y: this.player.pos.y },
      },
      map: { width: this.MAP_SIZE.x, height: this.MAP_SIZE.y },
      trashPoints: this.trash.points.map(v => ({ x: v.x, y: v.y })),
      isFinished: this.isFinished(),
    }
  }

  /**
   * @typedef {{ moveTo: { x: number, y: number } }} Command
   * @param {Command} cmd - player command
   */
  update(cmd) {
    if (this.isFinished()) return

    this.player.pos.set(cmd.moveTo.x, cmd.moveTo.y)

    if (this.trash.isPoint(this.player.pos)) {
      this.player.score += 1
      this.trash.drop(this.player.pos)
    }

    this.tick += 1
  }

  /** @type {import("../server/server.js").ServerEndpoint} */
  onScan() {
    return this.state()
  }

  /** @type {import("../server/server.js").ServerEndpoint} */
  onCommand(ctx, body) {
    if ( !body
      || typeof body !== 'object'
      || typeof body?.moveTo?.x !== 'number'
      || typeof body?.moveTo?.y !== 'number'
      || Number.isNaN(body.moveTo.x)
      || Number.isNaN(body.moveTo.y)
    ) {
      return { error: 'BAD_COMMAND' }
    }

    /** @type {Command} */
    const cmd = body

    const point = new Vec2(cmd.moveTo.x, cmd.moveTo.y)
    if (!this.player.pos.isNeighbor8(point) && !this.player.pos.equals(point)) {
      return { error: 'TO_FAR_AWAY' }
    }

    if ( cmd.moveTo.x > this.MAP_SIZE.x
      || cmd.moveTo.x < 0
      || cmd.moveTo.y > this.MAP_SIZE.y
      || cmd.moveTo.y < 0
    ) {
      return { error: 'OUT_OF_MAP' }
    }

    if (this.isFinished()) {
      return { error: 'GAME_FINISHED' }
    }

    this.update(cmd)

    return { success: true }
  }

}

const obj = new Game
obj.server.start()