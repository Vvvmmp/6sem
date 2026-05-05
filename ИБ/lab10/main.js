const crypto = require('crypto');
const { performance } = require('perf_hooks');
const fs = require('fs');

function modPow(base, exponent, modulus) {
    if (modulus === 1n) return 0n;
    let result = 1n;
    base = base % modulus;
    while (exponent > 0n) {
        if (exponent % 2n === 1n) result = (result * base) % modulus;
        exponent = exponent >> 1n;
        base = (base * base) % modulus;
    }
    return result;
}

function modInverse(a, m) {
    let m0 = m;
    let y = 0n, x = 1n;
    if (m === 1n) return 0n;
    while (a > 1n) {
        let q = a / m;
        let t = m;
        m = a % m;
        a = t;
        t = y;
        y = x - q * y;
        x = t;
    }
    if (x < 0n) x += m0;
    return x;
}

function randBigInt(min, max) {
    const range = max - min;
    const hexBytes = Math.ceil(range.toString(2).length / 8);
    let randomBigInt;
    do {
        const rnd = crypto.randomBytes(hexBytes);
        randomBigInt = BigInt('0x' + rnd.toString('hex'));
    } while (randomBigInt >= range);
    return randomBigInt + min;
}

function strToBigInt(str) {
    return BigInt('0x' + Buffer.from(str, 'utf8').toString('hex'));
}

function bigIntToStr(bi) {
    let hex = bi.toString(16);
    if (hex.length % 2 !== 0) hex = '0' + hex;
    return Buffer.from(hex, 'hex').toString('utf8');
}

class RSA {
    constructor(bits = 1024) {
        const p = crypto.generatePrimeSync(bits / 2, { bigint: true });
        const q = crypto.generatePrimeSync(bits / 2, { bigint: true });
        this.n = p * q;
        const phi = (p - 1n) * (q - 1n);
        this.e = 65537n;
        this.d = modInverse(this.e, phi);
    }

    encrypt(m) {
        return modPow(m, this.e, this.n);
    }

    decrypt(c) {
        return modPow(c, this.d, this.n);
    }
}

class ElGamal {
    constructor(bits = 1024) {
        this.p = crypto.generatePrimeSync(bits, { safe: true, bigint: true });
        this.q = (this.p - 1n) / 2n;
        this.g = 2n;
        while (modPow(this.g, 2n, this.p) === 1n || modPow(this.g, this.q, this.p) === 1n) {
            this.g++;
        }
        this.x = randBigInt(2n, this.p - 2n);
        this.y = modPow(this.g, this.x, this.p);
    }

    encrypt(m) {
        const k = randBigInt(2n, this.p - 2n);
        const a = modPow(this.g, k, this.p);
        const b = (modPow(this.y, k, this.p) * (m % this.p)) % this.p;
        return { a, b };
    }

    decrypt(a, b) {
        const s = modPow(a, this.x, this.p);
        const sInv = modInverse(s, this.p);
        return (b * sInv) % this.p;
    }
}

function modPow(base, exponent, modulus) {
    if (modulus === 1n) return 0n;
    let result = 1n;
    base = base % modulus;
    while (exponent > 0n) {
        if (exponent % 2n === 1n) result = (result * base) % modulus;
        exponent = exponent >> 1n;
        base = (base * base) % modulus;
    }
    return result;
}

const aVals = [5n, 35n];
const xPowers = [3, 15, 30, 45, 60, 75, 90, 100]; 
const nBitsList = [1024, 2048];

console.log('Генерация модулей n...');
const nValues = {
    1024: crypto.generatePrimeSync(1024, { bigint: true }),
    2048: crypto.generatePrimeSync(2048, { bigint: true })
};

let csvContent = '\uFEFFПорядок x;' + 
                 'a=5 n=1024 (мс);a=35 n=1024 (мс);' + 
                 'a=5 n=2048 (мс);a=35 n=2048 (мс)\n';

console.log('Выполнение вычислений и замер времени...');

for (const power of xPowers) {
    const xStr = '1' + '0'.repeat(power);
    const x = BigInt(xStr) + 7n; 

    let row = `10^${power}`;

    for (const nBits of nBitsList) {
        for (const a of aVals) {
            const n = nValues[nBits];
            
            const start = performance.now();
            modPow(a, x, n);
            const end = performance.now();
            
            const timeMs = (end - start).toFixed(4).replace('.', ',');
            row += `;${timeMs}`;
        }
    }
    csvContent += row + '\n';
}

fs.writeFileSync('export_results.csv', csvContent, 'utf8');
console.log('Файл export_results.csv успешно создан!');

function task2and3() {
    console.log("\nШифрование текста, замеры времени и анализ объемов");
    
    const fio = "Лужецкий Владислав Константинович";
    const base64Fio = Buffer.from(fio).toString('base64');
    console.log(`Исходный текст: ${fio}`);
    console.log(`Base64: ${base64Fio}`);
    
    const m = strToBigInt(fio);
    const mSize = Buffer.from(m.toString(16), 'hex').length;

    const bitLength = 1024;
    console.log(`\nГенерация ключей (${bitLength} бит)...`);
    const rsa = new RSA(bitLength);
    const elg = new ElGamal(bitLength);

    // RSA
    let start = performance.now();
    const rsaCipher = rsa.encrypt(m);
    let end = performance.now();
    const rsaEncTime = end - start;

    start = performance.now();
    const rsaDec = rsa.decrypt(rsaCipher);
    end = performance.now();
    const rsaDecTime = end - start;

    const rsaCipherSize = Buffer.from(rsaCipher.toString(16).padStart(bitLength/4, '0'), 'hex').length;

    // El-Gamal
    start = performance.now();
    const elgCipher = elg.encrypt(m);
    end = performance.now();
    const elgEncTime = end - start;

    start = performance.now();
    const elgDec = elg.decrypt(elgCipher.a, elgCipher.b);
    end = performance.now();
    const elgDecTime = end - start;

    const elgSizeA = Buffer.from(elgCipher.a.toString(16).padStart(bitLength/4, '0'), 'hex').length;
    const elgSizeB = Buffer.from(elgCipher.b.toString(16).padStart(bitLength/4, '0'), 'hex').length;
    const elgCipherSize = elgSizeA + elgSizeB;

    console.log("\n--- Результаты RSA ---");
    console.log(`Расшифрованный текст: ${bigIntToStr(rsaDec)}`);
    console.log(`Время зашифрования: ${rsaEncTime.toFixed(4)} мс`);
    console.log(`Время расшифрования: ${rsaDecTime.toFixed(4)} мс`);
    console.log(`Размер открытого текста: ${mSize} байт`);
    console.log(`Размер криптотекста: ${rsaCipherSize} байт`);
    console.log(`Коэффициент увеличения: ${(rsaCipherSize / mSize).toFixed(2)}x`);

    console.log("\n--- Результаты Эль-Гамаля ---");
    console.log(`Расшифрованный текст: ${bigIntToStr(elgDec)}`);
    console.log(`Время зашифрования: ${elgEncTime.toFixed(4)} мс`);
    console.log(`Время расшифрования: ${elgDecTime.toFixed(4)} мс`);
    console.log(`Размер открытого текста: ${mSize} байт`);
    console.log(`Размер криптотекста: ${elgCipherSize} байт (a: ${elgSizeA}, b: ${elgSizeB})`);
    console.log(`Коэффициент увеличения: ${(elgCipherSize / mSize).toFixed(2)}x`);
}

task2and3();