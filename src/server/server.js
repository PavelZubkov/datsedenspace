const http = require('http');

class Server {
  constructor() {
    this.server = http.createServer((req, res) => this.requestHandler(req, res));
  }

  port = 3000

  start() {
    this.server.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }

  requestHandler(req, res) {
    const { url, method } = req;

    if (url === '/api/scan' && method === 'GET') {
      this.handleScanRequest(req, res);
    }
    else if (url === '/api/shipCommand' && method === 'POST') {
      this.handleShipCommandRequest(req, res);
    }
    else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Endpoint not found' }));
    }
  }

  handleScanRequest(req, res) {
    const response = {
      success: true,
      data: {
        message: 'Scan data retrieved successfully',
      },
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response));
  }

  handleShipCommandRequest(req, res) {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString(); // Преобразуем Buffer в строку
    });

    req.on('end', () => {
      const response = {
        success: true,
        data: {
          message: 'Commands received successfully',
          commands: JSON.parse(body),
        },
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    });
  }
}