import { Rewind } from './rewind.js';

const rewind = new Rewind('127.0.0.1', 9111);
let x = 0, y = 0; // Начальные координаты для фигур
const moveStep = 10; // Шаг смещения для каждого нового кадра
const maxFrames = 500; // Количество кадров анимации

rewind.message('1 Hello WORLD \n OK \n BAD')

rewind.circlePopup(100, 100, 100, 'What IS?????? \n next line')

for (let frame = 0; frame < maxFrames; frame++) {
    // Начинаем новый кадр
    // client.setOptions();

    x += moveStep

    if (x > 1000) {
      x = 0
    }

    // Рисуем четыре фигуры в каждом кадре, смещая их каждый раз
    rewind.circle(x, y, 10, Rewind.RED, true);
    // client.rectangle(x, y + 30, x + 50, y + 30 + 20, RewindClient.GREEN, true);
    // client.triangle([x, y], [x + 80 + frame * moveStep, y], [x + 70 + frame * moveStep, y + 20], RewindClient.BLUE, true);
    // client.polyline([[x, y], [x + 110 + frame * moveStep, y + 20], [x + 90 + frame * moveStep, y + 40]], RewindClient.DARK_RED);

    // Завершаем кадр
    rewind.endFrame();
}
