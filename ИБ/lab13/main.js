const express = require('express');
const multer = require('multer');
const { PNG } = require('pngjs');
const path = require('path');

const app = express();
const upload = multer({ storage: multer.memoryStorage() }); 

function textToBits(text) {
    const buf = Buffer.from(text, 'utf8');
    const bits = [];
    for (let i = 0; i < buf.length; i++) {
        for (let j = 7; j >= 0; j--) bits.push((buf[i] >> j) & 1);
    }
    return bits;
}

function bitsToText(bits) {
    const bytes = [];
    for (let i = 0; i < bits.length; i += 8) {
        let byte = 0;
        for (let j = 0; j < 8; j++) byte |= (bits[i + j] << (7 - j));
        bytes.push(byte);
    }
    return Buffer.from(bytes).toString('utf8');
}

function lengthToBits(len) {
    const bits = [];
    const binStr = len.toString(2).padStart(32, '0');
    for (let char of binStr) bits.push(parseInt(char));
    return bits;
}

function embedLinear(png, msgBits) {
    const lenBits = lengthToBits(msgBits.length);
    const totalBits = lenBits.concat(msgBits);
    
    let bitIdx = 0;
    for (let i = 0; i < png.data.length; i++) {
        if ((i + 1) % 4 === 0) continue; 
        if (bitIdx < totalBits.length) {
            png.data[i] = (png.data[i] & 0xFE) | totalBits[bitIdx++];
        } else break;
    }
    return png;
}

function extractLinear(png) {
    const extracted = [];
    for (let i = 0; i < png.data.length; i++) {
        if ((i + 1) % 4 === 0) continue;
        extracted.push(png.data[i] & 1);
        
        if (extracted.length === 32) {
            const msgLen = parseInt(extracted.join(''), 2);
            if (msgLen > png.data.length || msgLen === 0) return "Ошибка: Сообщение не найдено или файл поврежден.";
        }
        if (extracted.length > 32 && extracted.length === 32 + parseInt(extracted.slice(0, 32).join(''), 2)) {
            break;
        }
    }
    return bitsToText(extracted.slice(32));
}

function embedScattered(png, msgBits) {
    const lenBits = lengthToBits(msgBits.length);
    
    const validIndices = [];
    for (let i = 0; i < png.data.length; i++) {
        if ((i + 1) % 4 !== 0) validIndices.push(i);
    }

    for (let i = 0; i < 32; i++) {
        png.data[validIndices[i]] = (png.data[validIndices[i]] & 0xFE) | lenBits[i];
    }

    const remainingIndices = validIndices.slice(32);
    const step = Math.floor(remainingIndices.length / msgBits.length);
    
    for (let i = 0; i < msgBits.length; i++) {
        const targetIdx = remainingIndices[i * step];
        png.data[targetIdx] = (png.data[targetIdx] & 0xFE) | msgBits[i];
    }
    return png;
}

function extractScattered(png) {
    const validIndices = [];
    for (let i = 0; i < png.data.length; i++) {
        if ((i + 1) % 4 !== 0) validIndices.push(i);
    }

    const lenBits = [];
    for (let i = 0; i < 32; i++) {
        lenBits.push(png.data[validIndices[i]] & 1);
    }
    const msgLen = parseInt(lenBits.join(''), 2);
    if (msgLen > validIndices.length || msgLen === 0) return "Ошибка: Сообщение не найдено.";

    const remainingIndices = validIndices.slice(32);
    const step = Math.floor(remainingIndices.length / msgLen);
    
    const msgBits = [];
    for (let i = 0; i < msgLen; i++) {
        const targetIdx = remainingIndices[i * step];
        msgBits.push(png.data[targetIdx] & 1);
    }
    
    return bitsToText(msgBits);
}


app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <title>Стеганография НЗБ (LSB)</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f4f4f9; padding: 20px; }
            .container { max-width: 800px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h2 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
            .box { padding: 15px; border: 1px solid #ccc; border-radius: 5px; margin-bottom: 20px; background: #fafafa; }
            button { background: #007bff; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
            button:hover { background: #0056b3; }
            input[type="file"], select, textarea { width: 100%; margin: 10px 0; padding: 8px; box-sizing: border-box; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Лабораторная №13: Стеганография НЗБ</h2>
            
            <div class="box">
                <h3>1. Встраивание (Осаждение)</h3>
                <form action="/embed" method="POST" enctype="multipart/form-data">
                    <label>Выберите PNG-контейнер:</label>
                    <input type="file" name="image" accept="image/png" required>
                    <label>Тайное сообщение:</label>
                    <textarea name="text" rows="4" required placeholder="Введите ФИО или текст отчета..."></textarea>
                    <label>Метод размещения:</label>
                    <select name="method">
                        <option value="linear">Метод 1: Последовательный (Подряд)</option>
                        <option value="scattered">Метод 2: Распределенный (Равномерный шаг)</option>
                    </select>
                    <button type="submit">Спрятать текст и скачать PNG</button>
                </form>
            </div>

            <div class="box">
                <h3>2. Извлечение</h3>
                <form action="/extract" method="POST" enctype="multipart/form-data">
                    <label>Выберите стеганоконтейнер (PNG):</label>
                    <input type="file" name="image" accept="image/png" required>
                    <label>Метод размещения:</label>
                    <select name="method">
                        <option value="linear">Метод 1: Последовательный</option>
                        <option value="scattered">Метод 2: Распределенный</option>
                    </select>
                    <button type="submit">Извлечь текст</button>
                </form>
            </div>

            <div class="box" style="border-color: #28a745;">
                <h3 style="color: #28a745;">3. Анализ: Цветовая матрица НЗБ</h3>
                <p>Отображает младшие биты изображения. 1 = белый пиксель, 0 = черный пиксель. Помогает увидеть вмешательство в картинку.</p>
                <form action="/matrix" method="POST" enctype="multipart/form-data">
                    <input type="file" name="image" accept="image/png" required>
                    <button type="submit" style="background: #28a745;">Сгенерировать матрицу (Анализ)</button>
                </form>
            </div>
        </div>
    </body>
    </html>
    `);
});

app.post('/embed', upload.single('image'), (req, res) => {
    const png = PNG.sync.read(req.file.buffer);
    const msgBits = textToBits(req.body.text);
    
    if (msgBits.length + 32 > png.width * png.height * 3) {
        return res.status(400).send("Ошибка: Контейнер слишком мал для этого сообщения.");
    }

    const modifiedPng = req.body.method === 'linear' 
        ? embedLinear(png, msgBits) 
        : embedScattered(png, msgBits);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="stego_container.png"');
    res.send(PNG.sync.write(modifiedPng));
});

app.post('/extract', upload.single('image'), (req, res) => {
    const png = PNG.sync.read(req.file.buffer);
    const result = req.body.method === 'linear' 
        ? extractLinear(png) 
        : extractScattered(png);
    res.send(`<h3>Извлеченное сообщение:</h3><p style="font-size: 18px; border: 1px solid #000; padding: 10px;">${result}</p><a href="/">Назад</a>`);
});

app.post('/matrix', upload.single('image'), (req, res) => {
    const png = PNG.sync.read(req.file.buffer);
    
    for (let i = 0; i < png.data.length; i += 4) {
        const r_lsb = png.data[i] & 1;
        const g_lsb = png.data[i+1] & 1;
        const b_lsb = png.data[i+2] & 1;
        
        const bw = (r_lsb || g_lsb || b_lsb) ? 255 : 0; 
        
        png.data[i] = bw;     
        png.data[i+1] = bw;   
        png.data[i+2] = bw;   
        png.data[i+3] = 255;  
    }

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="lsb_matrix.png"');
    res.send(PNG.sync.write(png));
});

app.listen(PORT = 3000, () => {
    console.log(`Приложение запущено! Открой в браузере: http://localhost:3000`);
});