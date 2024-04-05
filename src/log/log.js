import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export class Log {
    constructor(id) {
        this.id = id;
        this.fileName = `${id}.json`;
        // Преобразуем URL в путь, корректный для Windows
        const dirName = fileURLToPath(new URL('.', import.meta.url));
        this.filePath = path.join(dirName, this.fileName);
        fs.writeFileSync(this.filePath, '');
    }

    addToLog(json) {
        try {
            fs.appendFileSync(this.filePath, JSON.stringify(json) + '\n');
            console.log(`Added to log: ${JSON.stringify(json)}`);
        } catch (error) {
            console.error(`Error writing to log file: ${error.message}`);
        }
    }

    // Метод для чтения лога и возвращения массива объектов
    readLog() {
        try {
            const data = fs.readFileSync(this.filePath, { encoding: 'utf-8' });
            // Преобразуем строки в массив объектов
            return data.trim().split('\n').map(JSON.parse);
        } catch (error) {
            console.error(`Error reading from log file: ${error.message}`);
            return []; // В случае ошибки возвращаем пустой массив
        }
    }
}

// // Пример использования
// const logger = new Logger('example');
// logger.addToLog({ message: 'Hello, world!' });
// logger.addToLog({ message: 'Another message' });