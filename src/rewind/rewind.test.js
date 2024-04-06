import { Vec2 } from '../math/math.js'
import { Rewind } from './rewind.js';


// Draw grid

// Rewind.instance.drawGrid()

const figure = [[0,0],[1,0],[2,0],[0,1],[2,1],[3,1],[3,2]]

/** 
 * @param {Vec2} pos
 * @param {[x: number, y: number][]} figure
 */
function drawFigure(pos, figure) {
  for (const [x, y] of figure) {
    const topLeft = pos.clone().add({ x, y }).multiplyScalar(Rewind.SIZE)
    const bottomRight = topLeft.clone().addScalar(Rewind.SIZE)

    Rewind.instance.rectangle(topLeft.x, topLeft.y, bottomRight.x, bottomRight.y , Rewind.GREEN, true)
  }
}

drawFigure(new Vec2(0, 0), figure)

drawFigure(new Vec2(0, 4), figure)

drawFigure(new Vec2(0, 8), figure)

Rewind.instance.endFrame()


// let x = 0, y = 0; // Начальные координаты для фигур
// const moveStep = 10; // Шаг смещения для каждого нового кадра
// const maxFrames = 500; // Количество кадров анимации

// rewind.message('1 Hello WORLD \n OK \n BAD')

// rewind.circlePopup(100, 100, 100, 'What IS?????? \n next line')

// for (let frame = 0; frame < maxFrames; frame++) {
//     // Начинаем новый кадр
//     // client.setOptions();

//     x += moveStep

//     if (x > 1000) {
//       x = 0
//     }

//     // Рисуем четыре фигуры в каждом кадре, смещая их каждый раз
//     rewind.circle(x, y, 10, Rewind.RED, true);
//     // client.rectangle(x, y + 30, x + 50, y + 30 + 20, RewindClient.GREEN, true);
//     // client.triangle([x, y], [x + 80 + frame * moveStep, y], [x + 70 + frame * moveStep, y + 20], RewindClient.BLUE, true);
//     // client.polyline([[x, y], [x + 110 + frame * moveStep, y + 20], [x + 90 + frame * moveStep, y + 40]], RewindClient.DARK_RED);

//     // Завершаем кадр
//     rewind.endFrame();
// }
