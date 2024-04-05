## Запуск

- Установить последнюю nodejs https://nodejs.org/en/download/current
- Устанавливаем yarn: `npm i -g yarn`
- Установить гит
- Установить VSCode https://code.visualstudio.com/download
- Установить в VSCode плагин EditorConfig https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig 
- Клонируем репу https://github.com/PavelZubkov/datsedenspace.git
- Переходим в терминале в репу и запускаем 'yarn install'
- Скопировать .env.example в .env и в нем прописать значение для токена `TOKEN=токен`
- Бот запускается `node ./src/bot/bot.js`

# Папки
api - отправка запросов к их серверу
bot - вся логика бота
game - зачаток эмулятора их сервера
log - для писания логов в json файлы
math - класс вектора
rewind - прога для рисования, там прямо `exe` ее. Запуск примера рисования node `./src/rewind/rewind.test.js`
server - простая реализация http сервера, юзается в game