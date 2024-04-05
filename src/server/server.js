import * as http from 'http'

/**
 * @typedef {(ctx: { req: http.IncomingMessage, res: http.ServerResponse }, body: any) => Promise<Object> | Object} ServerEndpoint
 * 
 * @typedef {{
 *  [path: string]: {
 *    [method: string]: ServerEndpoint,
 *  }
 * }} ServerEndpoints
 */
export class Server {
  /**
   * @param {ServerEndpoints} endpoints 
   */
  constructor(endpoints) {
    this.endpoints = endpoints
    this.server = http.createServer((req, res) => this.requestHandler(req, res))
  }

  /** @type {ServerEndpoints} */
  endpoints

  port = 3000

  start() {
    this.server.listen(this.port, () => {
      console.log(`Server is running on port ${this.port} at ${new Date}`)
    })
  }

  /** @param {http.IncomingMessage} req */
  async receiveArgs(req) {
    const buffers = []
    for await (const chunk of req) buffers.push(chunk)
    const data = Buffer.concat(buffers).toString()
    try {
      return JSON.parse(data)
    } catch(err) {
      return null
    }
  };

  /**
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   */
  async requestHandler(req, res) {
    // console.log(`${req.method} ${req.url}`)

    if (!req.url || !req.method) {
      // console.log(`${req.method} ${req.url} 400`)
      res.statusCode = 400
      res.end(JSON.stringify(this.endpoints, null, 2))
      return
    }

    const method = this.endpoints?.[req.url]?.[req.method]

    if (!method) {
      // console.log(`${req.method} ${req.url} 404`)
      res.statusCode = 404
      res.end(JSON.stringify(this.endpoints, null, 2))
      return
    }

    const ctx = { req, res }
    const body = await this.receiveArgs(req)

    try {
      const json = await method(ctx, body)
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(json, null, 2))
      // console.log(`${req.method} ${req.url} 200 ${JSON.stringify(body)}`)
      // console.log(JSON.stringify(json, null, 2))
    } catch (err) {
      // console.log(`${req.method} ${req.url} 500`)
      // console.error(err)
      res.statusCode = 500
      res.end(JSON.stringify(err))
    }
  }

}