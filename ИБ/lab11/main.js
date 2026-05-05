const http = require('http');
const crypto = require('crypto');
const { performance } = require('perf_hooks');
const fs = require('fs');

const PORT = 3000;

const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Хеш-функции</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        h2 { text-align: center; color: #333; }
        label { font-weight: bold; margin-top: 15px; display: block; }
        select, textarea, button, input { width: 100%; padding: 10px; margin-top: 5px; box-sizing: border-box; border-radius: 4px; border: 1px solid #ccc; }
        button { background-color: #007bff; color: white; border: none; cursor: pointer; font-weight: bold; margin-top: 15px; }
        button:hover { background-color: #0056b3; }
        .speed-box { margin-top: 30px; padding: 15px; border: 2px dashed #007bff; border-radius: 8px; background: #e9f5ff; }
        .result { background: #eee; font-family: monospace; word-break: break-all; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Хеширование (MD и SHA)</h2>
        
        <label>Выберите алгоритм:</label>
        <select id="algo">
            <option value="md5">MD5</option>
            <option value="sha1">SHA-1</option>
            <option value="sha256">SHA-256</option>
            <option value="sha512">SHA-512</option>
        </select>

        <label>Введите сообщение (M):</label>
        <textarea id="message" rows="4"></textarea>

        <button onclick="calculateHash()">Вычислить Хеш</button>

        <label>Результат (h):</label>
        <textarea id="result" rows="3" class="result" readonly></textarea>

        <div class="speed-box">
            <h3 style="margin-top:0; color: #0056b3; text-align: center;">Быстродействие текста из текстового файла 6000 символов</h3>
            <button onclick="runSpeedTest()" style="background-color: #28a745;">Провер</button>
            <p id="speedResult" style="text-align: center; font-weight: bold; margin-bottom: 0;">Нажмите кнопку для теста...</p>
        </div>
    </div>

    <script>
        async function calculateHash() {
            const algo = document.getElementById('algo').value;
            const text = document.getElementById('message').value;
            if(!text) return alert('Введите сообщение!');

            const res = await fetch('/hash', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ algo, text })
            });
            const data = await res.json();
            document.getElementById('result').value = data.hash || data.error;
        }

        async function runSpeedTest() {
            const algo = document.getElementById('algo').value;
            document.getElementById('speedResult').innerText = 'Идет вычисление...';
            
            const res = await fetch('/speed?algo=' + algo);
            const data = await res.json();
            if(data.error) {
                document.getElementById('speedResult').innerText = 'Ошибка: ' + data.error;
            } else {
                document.getElementById('speedResult').innerText = 
                    \`Время: \${data.time} сек | Скорость: \${data.speed} МБ/сек\`;
            }
        }
    </script>
</body>
</html>
`;

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
    } 
    else if (req.method === 'POST' && req.url === '/hash') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const { algo, text } = JSON.parse(body);
                const hash = crypto.createHash(algo).update(text, 'utf8').digest('hex');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ hash }));
            } catch (e) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: e.message }));
            }
        });
    } 
   else if (req.method === 'GET' && req.url.startsWith('/speed')) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const algo = url.searchParams.get('algo');
        try {
            const fileBuffer = fs.readFileSync('text.txt');
            
            const fileSizeMB = fileBuffer.length / (1024 * 1024);

            const start = performance.now();
            crypto.createHash(algo).update(fileBuffer).digest('hex');
            const end = performance.now();
            
            const elapsedSec = (end - start) / 1000;
            
            const speed = elapsedSec > 0 ? (fileSizeMB / elapsedSec) : 0; 

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                time: elapsedSec.toFixed(4), 
                speed: speed.toFixed(2) 
            }));
        } catch (e) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: "Ошибка при чтении файла (возможно, он не создан): " + e.message }));
        }
    }
});

server.listen(PORT, () => {
    console.log(`Сервер запущен! Открой браузер по адресу: http://localhost:${PORT}`);
});