const http = require('http');
const crypto = require('crypto');
const { performance } = require('perf_hooks');

const PORT = 3000;

function modPow(base, exp, mod) {
    if (mod === 1n) return 0n;
    let res = 1n;
    base = base % mod;
    while (exp > 0n) {
        if (exp % 2n === 1n) res = (res * base) % mod;
        exp = exp / 2n;
        base = (base * base) % mod;
    }
    return res;
}

function modInverse(a, m) {
    let m0 = m, y = 0n, x = 1n;
    if (m === 1n) return 0n;
    while (a > 1n) {
        let q = a / m, t = m;
        m = a % m; a = t; t = y;
        y = x - q * y; x = t;
    }
    if (x < 0n) x += m0;
    return x;
}

function randBigInt(min, max) {
    const range = max - min;
    const hexBytes = Math.ceil(range.toString(16).length / 2);
    let rndBi;
    do {
        rndBi = BigInt('0x' + crypto.randomBytes(hexBytes).toString('hex'));
    } while (rndBi >= range);
    return rndBi + min;
}

function hashMessageToBigInt(msg, mod) {
    const hashHex = crypto.createHash('sha256').update(msg).digest('hex');
    return BigInt('0x' + hashHex) % mod;
}


function rsaSignVerify(msg) {
    const t0 = performance.now();
    const p = crypto.generatePrimeSync(512, { bigint: true });
    const q = crypto.generatePrimeSync(512, { bigint: true });
    const n = p * q;
    const phi = (p - 1n) * (q - 1n);
    const e = 65537n;
    const d = modInverse(e, phi);
    
    const H = hashMessageToBigInt(msg, n);
    
    const t1 = performance.now();
    const S = modPow(H, d, n);
    const signTime = performance.now() - t1;

    const t2 = performance.now();
    const H_check = modPow(S, e, n);
    const isValid = H === H_check;
    const verifyTime = performance.now() - t2;

    return {
        pubKey: `e: ${e}\nn: ${n.toString().substring(0, 30)}...`,
        signature: `S: ${S.toString().substring(0, 30)}...`,
        genTime: (t1 - t0).toFixed(2),
        signTime: signTime.toFixed(2),
        verifyTime: verifyTime.toFixed(2),
        isValid
    };
}

function elGamalSignVerify(msg) {
    const t0 = performance.now();
    const p = crypto.generatePrimeSync(512, { safe: true, bigint: true });
    const g = 2n; 
    const x = randBigInt(2n, p - 2n); 
    const y = modPow(g, x, p);        

    const H = hashMessageToBigInt(msg, p - 1n);

    const t1 = performance.now();
    let k, kInv;
    do {
        k = randBigInt(2n, p - 2n);
        kInv = modInverse(k, p - 1n);
    } while (kInv === 0n);

    const a = modPow(g, k, p);
    let b = ((H - x * a) * kInv) % (p - 1n);
    if (b < 0n) b += (p - 1n);
    const signTime = performance.now() - t1;

    const t2 = performance.now();
    const left = (modPow(y, a, p) * modPow(a, b, p)) % p;
    const right = modPow(g, H, p);
    const isValid = left === right;
    const verifyTime = performance.now() - t2;

    return {
        pubKey: `p: ${p.toString().substring(0, 20)}...\ng: ${g}\ny: ${y.toString().substring(0, 20)}...`,
        signature: `a: ${a.toString().substring(0, 20)}...\nb: ${b.toString().substring(0, 20)}...`,
        genTime: (t1 - t0).toFixed(2),
        signTime: signTime.toFixed(2),
        verifyTime: verifyTime.toFixed(2),
        isValid
    };
}

function schnorrSignVerify(msg) {
    const t0 = performance.now();
    const q = crypto.generatePrimeSync(160, { bigint: true });
    let k_factor = 2n;
    let p;
    while (true) {
        p = q * k_factor + 1n;
        if (crypto.checkPrimeSync(p)) break;
        k_factor++;
    }
    let h_base = 2n, g;
    while (true) {
        g = modPow(h_base, (p - 1n) / q, p);
        if (g > 1n) break;
        h_base++;
    }
    
    const x = randBigInt(2n, q - 1n); 
    const y = modInverse(modPow(g, x, p), p); 

    const t1 = performance.now();
    const k = randBigInt(2n, q - 1n);
    const a = modPow(g, k, p);
    
    const hashHex = crypto.createHash('sha256').update(msg + a.toString()).digest('hex');
    const h = BigInt('0x' + hashHex) % q;
    const b = (k + x * h) % q;
    const signTime = performance.now() - t1;

    const t2 = performance.now();
    const X = (modPow(g, b, p) * modPow(y, h, p)) % p;
    const checkHex = crypto.createHash('sha256').update(msg + X.toString()).digest('hex');
    const h_check = BigInt('0x' + checkHex) % q;
    const isValid = h === h_check;
    const verifyTime = performance.now() - t2;

    return {
        pubKey: `p: ${p.toString().substring(0, 20)}...\nq: ${q.toString()}\ng: ${g.toString().substring(0,20)}...\ny: ${y.toString().substring(0,20)}...`,
        signature: `h: ${h.toString()}\nb: ${b.toString()}`,
        genTime: (t1 - t0).toFixed(2),
        signTime: signTime.toFixed(2),
        verifyTime: verifyTime.toFixed(2),
        isValid
    };
}


const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>ЭЦП</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        h2 { text-align: center; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        label { font-weight: bold; margin-top: 15px; display: block; }
        textarea, select, button { width: 100%; padding: 10px; margin-top: 5px; box-sizing: border-box; border-radius: 4px; border: 1px solid #ccc; }
        button { background-color: #007bff; color: white; font-size: 16px; cursor: pointer; margin-top: 20px; }
        button:hover { background-color: #0056b3; }
        .result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; }
        .box { background: #e9f5ff; padding: 10px; border-radius: 5px; border: 1px solid #b8daff; }
        pre { white-space: pre-wrap; word-wrap: break-word; font-size: 13px; margin: 5px 0; }
        .status { text-align: center; font-size: 18px; font-weight: bold; margin-top: 15px; }
        .valid { color: green; }
        .invalid { color: red; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Генерация и Верификация ЭЦП</h2>
        
        <label>Документ (Сообщение) для подписи:</label>
        <textarea id="message" rows="3">Тестовое сообщение</textarea>

        <label>Алгоритм ЭЦП:</label>
        <select id="algo">
            <option value="rsa">RSA (1024 bit)</option>
            <option value="elgamal">Эль-Гамаль (512 bit)</option>
            <option value="schnorr">Шнорр (p: 512 bit, q: 160 bit)</option>
        </select>

        <button onclick="processSignature()">Сгенерировать и Проверить Подпись</button>

        <div class="result-grid">
            <div class="box">
                <b>Открытый ключ (Для отправки):</b>
                <pre id="pubKey">-</pre>
            </div>
            <div class="box">
                <b>ЭЦП (Для отправки):</b>
                <pre id="signature">-</pre>
            </div>
        </div>

        <div class="box" style="margin-top: 15px; background: #fdfdfe; border-color: #e2e3e5;">
            <b>Оценка времени (мс):</b>
            <ul style="margin: 5px 0;">
                <li>Генерация параметров ключей: <span id="genTime">0</span> мс</li>
                <li>Формирование ЭЦП: <span id="signTime">0</span> мс</li>
                <li>Верификация ЭЦП: <span id="verifyTime">0</span> мс</li>
            </ul>
        </div>

        <div id="status" class="status"></div>
    </div>

    <script>
        async function processSignature() {
            const msg = document.getElementById('message').value;
            const algo = document.getElementById('algo').value;
            document.getElementById('status').innerHTML = "Вычисление...";
            document.getElementById('status').className = "status";

            const res = await fetch('/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ msg, algo })
            });
            const data = await res.json();
            
            document.getElementById('pubKey').innerText = data.pubKey;
            document.getElementById('signature').innerText = data.signature;
            document.getElementById('genTime').innerText = data.genTime;
            document.getElementById('signTime').innerText = data.signTime;
            document.getElementById('verifyTime').innerText = data.verifyTime;
            
            const statusEl = document.getElementById('status');
            if (data.isValid) {
                statusEl.innerText = " Подпись успешно верифицирована! Целостность подтверждена.";
                statusEl.className = "status valid";
            } else {
                statusEl.innerText = " Ошибка верификации!";
                statusEl.className = "status invalid";
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
    } else if (req.method === 'POST' && req.url === '/sign') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { msg, algo } = JSON.parse(body);
            let result;
            try {
                if (algo === 'rsa') result = rsaSignVerify(msg);
                else if (algo === 'elgamal') result = elGamalSignVerify(msg);
                else if (algo === 'schnorr') result = schnorrSignVerify(msg);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } catch (e) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: e.message }));
            }
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(PORT, () => {
    console.log(`Сервер ЭЦП запущен на http://localhost:${PORT}`);
});