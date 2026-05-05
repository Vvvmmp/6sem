const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const app = express();

app.use(express.json());

const SERVER_FILE = 'server_student.txt';
fs.writeFileSync(SERVER_FILE, 'Лужецкий Владислав Константинович');

function ServerSign() {
    console.log('[Server] Генерация новой пары ключей RSA (2048 бит)...');
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
    });

    let s = crypto.createSign('SHA256');
    this.getSignContext = (rs, cb) => {
        console.log('[Server] Чтение файла потоком и вычисление хеша SHA-256...');
        rs.pipe(s);
        rs.on('end', () => {
            console.log('[Server] Подписание хеша приватным ключом RSA...');
            cb({
                signature: s.sign(privateKey).toString('hex'),
                publicKey: publicKey 
            });
        });
    };
}

let fileRequested = false;

app.get('/', (req, res) => {
    console.log('\n[Server] GET / : Запрос на получение файла.');
    fileRequested = true; 
    const rs = fs.createReadStream(SERVER_FILE);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    console.log('[Server] Отправка содержимого файла клиенту...');
    rs.pipe(res);
});

app.get('/sign', (req, res) => {
    console.log('\n[Server] GET /sign : Запрос на получение цифровой подписи.');
    if (!fileRequested) {
        console.error('[Server] Ошибка: Клиент не запросил файл (GET /).');
        return res.status(409).json({ error: 'Error: do a GET / first' });
    }
    
    try {
        const ss = new ServerSign();
        const rs = fs.createReadStream(SERVER_FILE);
        
        ss.getSignContext(rs, (signContext) => {
            fileRequested = false;
            console.log('[Server] Подпись успешно сформирована. Отправка подписи и публичного ключа.');
            res.json(signContext);
        });
    } catch (e) {
        console.error('[Server] Ошибка при генерации подписи:', e.message);
        res.status(409).json({ error: 'Signature generation error' });
    }
});

app.listen(3000, () => {
    console.log('[Server] Сервер запущен на http://localhost:3000');
    console.log(`[Server] Исходный файл "${SERVER_FILE}" создан.`);
});