import * as net from 'net'

// https://github.com/kswaldemar/rewind-viewer/blob/master/clients/python3/RewindClient.py
// https://github.com/kswaldemar/rewind-viewer/blob/develop/clients/README.md

/**
 * Client for sending drawing commands to a Rewind viewer.
 */
export class Rewind {
    static RED = 0xff0000;
    static GREEN = 0x00ff00;
    static BLUE = 0x0000ff;
    static DARK_RED = 0x770000;
    static DARK_GREEN = 0x007700;
    static DARK_BLUE = 0x000077;
    static TRANSPARENT = 0x7f000000;
    static INVISIBLE = 0x01000000;

    /**
     * Constructs a RewindClient instance.
     * @param {string} [host='127.0.0.1'] - The host to connect to.
     * @param {number} [port=9111] - The port to connect on.
     */
    constructor(host = '127.0.0.1', port = 9111) {
        this.client = new net.Socket();

        this.client.on('error', (err) => {
            console.error('Connection error:', err);
        });

        this.client.connect(port, host, () => {
            console.log('Connected to server');
        });

        this.client.setNoDelay(true);
    }

    /**
     * Converts an array of points to a flat list for GeoJSON.
     * @param {Array<Array<number>>} points - The points to convert.
     * @returns {Array<number>} The flat list of points.
     */
    static toGeoJSON(points) {
        let flat = [];
        for (let p of points) {
            flat.push(p[0], p[1]);
        }
        return flat;
    }

    /**
     * Sends an object to the server.
     * @param {Object} obj - The object to send.
     */
    send(obj) {
        if (this.client) {
            this.client.write(JSON.stringify(obj) + '\n', 'utf-8');
        }
    }

    /**
     * Sends a line to be drawn by the viewer.
     * @param {number} x1 - The x coordinate of the first point.
     * @param {number} y1 - The y coordinate of the first point.
     * @param {number} x2 - The x coordinate of the second point.
     * @param {number} y2 - The y coordinate of the second point.
     * @param {number} color - The color of the line.
     */
    line(x1, y1, x2, y2, color) {
        this.send({
            type: 'polyline',
            points: [x1, y1, x2, y2],
            color: color
        });
    }

    /**
     * Sends a polyline to be drawn by the viewer.
     * @param {Array<Array<number>>} points - The points of the polyline.
     * @param {number} color - The color of the polyline.
     */
    polyline(points, color) {
        this.send({
            type: 'polyline',
            points: Rewind.toGeoJSON(points),
            color: color
        });
    }

    /**
     * Sends a circle to be drawn by the viewer.
     * @param {number} x - The x coordinate of the circle's center.
     * @param {number} y - The y coordinate of the circle's center.
     * @param {number} radius - The radius of the circle.
     * @param {number} color - The color of the circle.
     * @param {boolean} [fill=false] - Whether the circle should be filled.
     */
    circle(x, y, radius, color, fill = false) {
        this.send({
            type: 'circle',
            p: [x, y],
            r: radius,
            color: color,
            fill: fill
        });
    }

    /**
     * Sends a rectangle to be drawn by the viewer.
     * @param {number} x1 - The x coordinate of the top-left corner.
     * @param {number} y1 - The y coordinate of the top-left corner.
     * @param {number} x2 - The x coordinate of the bottom-right corner.
     * @param {number} y2 - The y coordinate of the bottom-right corner.
     * @param {number} color - The color of the rectangle.
     * @param {boolean} [fill=false] - Whether the rectangle should be filled.
     */
    rectangle(x1, y1, x2, y2, color, fill = false) {
        this.send({
            type: 'rectangle',
            tl: [x1, y1],
            br: [x2, y2],
            color: color,
            fill: fill
        });
    }

    /**
     * Sends a triangle to be drawn by the viewer.
     * @param {Array<number>} p1 - The first point of the triangle.
     * @param {Array<number>} p2 - The second point of the triangle.
     * @param {Array<number>} p3 - The third point of the triangle.
     * @param {number} color - The color of the triangle.
     * @param {boolean} [fill=false] - Whether the triangle should be filled.
     */
    triangle(p1, p2, p3, color, fill = false) {
        this.send({
            type: 'triangle',
            points: Rewind.toGeoJSON([p1, p2, p3]),
            color: color,
            fill: fill
        });
    }

    /**
     * Sends a circle popup to be displayed by the viewer.
     * @param {number} x - The x coordinate of the circle's center.
     * @param {number} y - The y coordinate of the circle's center.
     * @param {number} radius - The radius of the popup circle.
     * @param {string} message - The message to display in the popup.
     */
    circlePopup(x, y, radius, message) {
        this.send({
            type: 'popup',
            p: [x, y],
            r: radius,
            text: message
        });
    }

    /**
     * Sends a rectangular popup to be displayed by the viewer.
     * @param {Array<number>} tl - The top-left corner of the rectangle.
     * @param {Array<number>} br - The bottom-right corner of the rectangle.
     * @param {string} message - The message to display in the popup.
     */
    rectPopup(tl, br, message) {
        this.send({
            type: 'popup',
            tl: Rewind.toGeoJSON([tl]),
            br: Rewind.toGeoJSON([br]),
            text: message
        });
    }

    /**
     * Sends a message to be displayed by the viewer.
     * @param {string} msg - The message to display.
     */
    message(msg) {
        this.send({
            type: 'message',
            message: msg
        });
    }

    /**
     * Sets options for the drawing layer.
     * @param {number} [layer] - The layer to draw on.
     * @param {boolean} [permanent] - Whether the drawing is permanent.
     */
    setOptions(layer = 1, permanent = false) {
        let data = { type: 'options', layer, permanent };
        this.send(data);
    }

    /**
     * Sends a command to end the current frame and start a new one.
     */
    endFrame() {
        this.send({ type: 'end' });
    }
}