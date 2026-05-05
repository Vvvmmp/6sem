const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

function ServerDH(len_a, g) {
    const dh = crypto.createDiffieHellman(len_a, g);
    const p = dh.getPrime();
    const gb = dh.getGenerator();
    const k = dh.generateKeys();
    
    this.getContext = () => {
        return {
            p_hex: p.toString('hex'),
            g_hex: gb.toString('hex'),
            key_hex: k.toString('hex')
        };
    };
    
    this.getSecret = (clientContext) => {
        const k = Buffer.from(clientContext.key_hex, 'hex');
        return dh.computeSecret(k);
    };
}

let serverDH;
let serverSecret;

app.get('/', (req, res) => {
    console.log('\n[Server] GET / : Запрос на инициализацию...');
    console.log('[Server] Генерация параметров Diffie-Hellman (1024 бит)...');
    serverDH = new ServerDH(1024, 3);
    serverSecret = null;
    console.log('[Server] Отправка публичных параметров (p, g, pubKey) клиенту.');
    res.json(serverDH.getContext());
});

app.post('/exchange', (req, res) => {
    console.log('\n[Server] POST /exchange : Получен публичный ключ от клиента.');
    if (!serverDH) {
        console.error('[Server] Ошибка: Клиент не запросил базовые параметры (GET /).');
        return res.status(409).json({ error: 'Error: do a GET / first' });
    }
    try {
        const clientContext = req.body;
        console.log('[Server] Вычисление общего секрета с использованием ключа клиента...');
        serverSecret = serverDH.getSecret(clientContext);
        console.log('[Server] Общий секретный ключ успешно вычислен!');
        res.status(200).send('OK');
    } catch (e) {
        console.error('[Server] Ошибка при обмене ключами:', e.message);
        res.status(409).json({ error: 'Key exchange error' });
    }
});

app.get('/resource', (req, res) => {
    console.log('\n[Server] GET /resource : Запрос на получение секретных данных.');
    if (!serverSecret) {
        console.error('[Server] Ошибка: Общий секрет еще не установлен.');
        return res.status(409).json({ error: 'Error: secret not calculated' });
    }

    const studentInfo = "Лужецкий Владислав Константинович";
    console.log('[Server] Подготовка ключа AES-256 (через SHA-256)...');
    
    const key = crypto.createHash('sha256').update(serverSecret).digest();
    const iv = crypto.randomBytes(16); 
    
    console.log('[Server] Шифрование данных алгоритмом AES-256-CBC...');
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(studentInfo, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    console.log('[Server] Данные зашифрованы. Отправка пакета клиенту.');
    res.json({
        iv: iv.toString('hex'),
        data: encrypted
    });
});

app.listen(3000, () => {
    console.log('[Server] Сервер запущен на http://localhost:3000');
});