import { Rewind } from '../rewind/rewind.js'
/**
 * Класс, представляющий фигуру.
 */
class Rectangle {
  /**
   * Создает экземпляр Rectangle.
   * @param {string} id Идентификатор фигуры.
   * @param {Array<Array<number>>} points Точки, описывающие форму фигуры.
   */
  constructor(id, points) {
    this.id = id;
    this.points = points;
    this.rotation = 0; // Степень вращения: 0, 90, 180, 270
  }

  /**
   * Вращает фигуру на 90 градусов по часовой стрелке.
   * @returns {Rectangle} Возвращает экземпляр фигуры для поддержки цепочек вызовов.
   */
  rotate() {
    this.rotation = (this.rotation + 90) % 360;
    return this;
  }

  /**
   * Получает точки фигуры с учетом текущего вращения.
   * @returns {Array<Array<number>>} Массив точек после вращения.
   */
  getRotatedPoints() {
    let rotatedPoints = this.points;
    for (let i = 0; i < this.rotation / 90; i++) {
      rotatedPoints = rotatedPoints.map(p => [p[1], 3 - p[0]]);
    }
    return rotatedPoints;
  }
}

/**
 * Класс, представляющий доску для размещения фигур.
 */
class Board {
  rewind = new Rewind
  /**
   * Создает экземпляр Board.
   */
  constructor() {
    this.width = 11;
    this.height = 8;
    this.board = Array.from({ length: 8 }, () => Array(11).fill(false));
    this.placedFigures = [];
    this.unplacedFigures = [];
  }

  drawFigures(figures) {

  }

  /**
   * Пытается разместить набор фигур на доске.
   * @param {Rectangle[]} figures Массив фигур для размещения.
   */
  placeFigures(figures) {
    figures.forEach(figure => {
      if (!this.tryPlaceFigure(figure)) {
        this.unplacedFigures.push(figure);
      }
    });
  }

  /**
   * Пытается разместить одну фигуру на доске, проверяя все возможные положения и вращения.
   * @param {Rectangle} figure Фигура для размещения.
   * @returns {boolean} Возвращает true, если удалось разместить фигуру.
   */
  tryPlaceFigure(figure) {
    for (let i = 0; i < 4; i++) { // Проверяем все возможные вращения
      for (let x = 0; x < this.height; x++) {
        for (let y = 0; y < this.width; y++) {
          if (this.canPlaceFigure(figure, x, y)) {
            this.placeFigure(figure, x, y);
            return true;
          }
        }
      }
      figure.rotate();
    }
    return false;
  }

  /**
   * Проверяет, можно ли разместить фигуру в указанном положении на доске.
   * @param {Rectangle} figure Фигура для размещения.
   * @param {number} x Координата X левого верхнего угла фигуры на доске.
   * @param {number} y Координата Y левого верхнего угла фигуры на доске.
   * @returns {boolean} Возвращает true, если фигуру можно разместить.
   */
  canPlaceFigure(figure, x, y) {
    return figure.getRotatedPoints().every(([px, py]) => {
      const newX = x + px;
      const newY = y + py;
      return newX >= 0 && newY >= 0 && newX < this.height && newY < this.width && !this.board[newX][newY];
    });
  }

  /**
   * Размещает фигуру в указанном положении на доске и обновляет состояние доски.
   * @param {Rectangle} figure Фигура для размещения.
   * @param {number} x Координата X левого верхнего угла фигуры на доске.
   * @param {number} y Координата Y левого верхнего угла фигуры на доске.
   */
  placeFigure(figure, x, y) {
    figure.getRotatedPoints().forEach(([px, py]) => {
      this.board[x + px][y + py] = true;
    });
    this.placedFigures.push(figure);
  }
}

/**
 * Тестирует размещение одной маленькой фигуры.
 */
function testSingleFigurePlacement() {
  const board = new Board();
  const figures = [new Rectangle("1", [[0, 0]])]; // Фигура размером 1x1
  board.placeFigures(figures);
  console.assert(board.placedFigures.length === 1, "Failed to place a single small figure");
}

/**
 * Тестирует необходимость вращения для размещения фигуры.
 */
function testRotationNecessary() {
  const board = new Board();
  // Фигура, требующая вращения для размещения
  const figures = [new Rectangle("1", [[0, 0], [1, 0], [2, 0], [3, 0]])];
  board.placeFigures(figures);
  console.assert(board.placedFigures.length === 1, "Failed to place a figure requiring rotation");
}

/**
 * Тестирует случай, когда некоторые фигуры невозможно разместить.
 */
function testUnplaceableFigures() {
  const board = new Board();
  // Несколько больших фигур, превышающих размер доски
  const figures = Array.from({ length: 10 }, (_, i) => new Rectangle(String(i), Array.from({ length: 16 }, (_, j) => [Math.floor(j / 4), j % 4])));
  board.placeFigures(figures);
  console.assert(board.unplacedFigures.length > 0, "Failed to identify unplaceable figures");
}

/**
 * Тестирует идеальное заполнение доски без свободного места.
 */
function testPerfectFit() {
  const board = new Board();
  // Фигуры, идеально заполняющие доску
  const figures = Array.from({ length: 22 }, (_, i) => new Rectangle(String(i), Array.from({ length: 4 }, (_, j) => [j % 4, Math.floor(j / 4)])));
  board.placeFigures(figures);
  console.assert(board.placedFigures.length === 22, "Failed to perfectly fill the board");
}

/**
 * Тестирует обработку пустого списка фигур.
 */
function testEmptyInput() {
  const board = new Board();
  const figures = [];
  board.placeFigures(figures);
  console.assert(board.placedFigures.length === 0 && board.unplacedFigures.length === 0, "Failed to handle empty input correctly");
}

// Вызываем тестовые функции
testSingleFigurePlacement();
testRotationNecessary();
testUnplaceableFigures();
testPerfectFit();
testEmptyInput();

console.log("All tests passed successfully!");
