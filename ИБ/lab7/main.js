const fs = require('fs');
const zlib = require('zlib');
const { performance } = require('perf_hooks');

const IP = [58,50,42,34,26,18,10,2,60,52,44,36,28,20,12,4,62,54,46,38,30,22,14,6,64,56,48,40,32,24,16,8,57,49,41,33,25,17,9,1,59,51,43,35,27,19,11,3,61,53,45,37,29,21,13,5,63,55,47,39,31,23,15,7];
const FP = [40,8,48,16,56,24,64,32,39,7,47,15,55,23,63,31,38,6,46,14,54,22,62,30,37,5,45,13,53,21,61,29,36,4,44,12,52,20,60,28,35,3,43,11,51,19,59,27,34,2,42,10,50,18,58,26,33,1,41,9,49,17,57,25];
const E = [32,1,2,3,4,5,4,5,6,7,8,9,8,9,10,11,12,13,12,13,14,15,16,17,16,17,18,19,20,21,20,21,22,23,24,25,24,25,26,27,28,29,28,29,30,31,32,1];
const P = [16,7,20,21,29,12,28,17,1,15,23,26,5,18,31,10,2,8,24,14,32,27,3,9,19,13,30,6,22,11,4,25];
const PC1 = [57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4];
const PC2 = [14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32];
const SHIFTS = [1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1];
const S = [
  [[14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7],[0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8],[4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0],[15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13]],
  [[15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10],[3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5],[0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15],[13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9]],
  [[10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8],[13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1],[13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7],[1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12]],
  [[7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15],[13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9],[10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4],[3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14]],
  [[2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9],[14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6],[4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14],[11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3]],
  [[12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11],[10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8],[9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6],[4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13]],
  [[4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1],[13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6],[1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2],[6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12]],
  [[13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7],[1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2],[7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8],[2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11]]
];

function permute(bits, table) {
    let res = [];
    for (let i = 0; i < table.length; i++) {
        res.push(bits[table[i] - 1]);
    }
    return res;
}

function leftShift(bits, n) {
    return bits.slice(n).concat(bits.slice(0, n));
}

function xor(a, b) {
    let res = [];
    for (let i = 0; i < a.length; i++) res.push(a[i] ^ b[i]);
    return res;
}

function generateSubkeys(keyBits) {
    let key56 = permute(keyBits, PC1);
    let C = key56.slice(0, 28);
    let D = key56.slice(28, 56);
    let subkeys = [];
    for (let i = 0; i < 16; i++) {
        C = leftShift(C, SHIFTS[i]);
        D = leftShift(D, SHIFTS[i]);
        subkeys.push(permute(C.concat(D), PC2));
    }
    return subkeys;
}

function sBoxSub(bits) {
    let res = [];
    for (let i = 0; i < 8; i++) {
        let chunk = bits.slice(i * 6, (i + 1) * 6);
        let row = (chunk[0] << 1) | chunk[5];
        let col = (chunk[1] << 3) | (chunk[2] << 2) | (chunk[3] << 1) | chunk[4];
        let val = S[i][row][col];
        res.push((val >> 3) & 1, (val >> 2) & 1, (val >> 1) & 1, val & 1);
    }
    return res;
}

function f(R, K) {
    let expR = permute(R, E);
    let xored = xor(expR, K);
    let sub = sBoxSub(xored);
    return permute(sub, P);
}

function desBlock(blockBits, subkeys, trackAvalanche = false) {
    let ip = permute(blockBits, IP);
    let L = ip.slice(0, 32);
    let R = ip.slice(32, 64);
    let history = [];
    for (let i = 0; i < 16; i++) {
        let prevL = L;
        L = R;
        R = xor(prevL, f(R, subkeys[i]));
        if (trackAvalanche) history.push(L.concat(R));
    }
    let fp = permute(R.concat(L), FP);
    return trackAvalanche ? { result: fp, history } : fp;
}

function strToBits(str) {
    let bits = [];
    let buf = Buffer.from(str, 'utf8');
    for (let i = 0; i < buf.length; i++) {
        for (let j = 7; j >= 0; j--) {
            bits.push((buf[i] >> j) & 1);
        }
    }
    return bits;
}

function bitsToStr(bits) {
    let buf = Buffer.alloc(bits.length / 8);
    for (let i = 0; i < bits.length; i += 8) {
        let byte = 0;
        for (let j = 0; j < 8; j++) {
            byte |= (bits[i + j] << (7 - j));
        }
        buf[i / 8] = byte;
    }
    return buf.toString('utf8');
}

function pad(bits) {
    let padLen = 64 - (bits.length % 64);
    let padByte = padLen / 8;
    for (let i = 0; i < padLen; i += 8) {
        for (let j = 7; j >= 0; j--) bits.push((padByte >> j) & 1);
    }
    return bits;
}

function unpad(bits) {
    let lastByte = 0;
    for (let j = 0; j < 8; j++) lastByte |= (bits[bits.length - 8 + j] << (7 - j));
    return bits.slice(0, bits.length - lastByte * 8);
}

function hexToBits(hex) {
    let bits = [];
    for (let i = 0; i < hex.length; i++) {
        let val = parseInt(hex[i], 16);
        for (let j = 3; j >= 0; j--) {
            bits.push((val >> j) & 1);
        }
    }
    return bits;
}

function processData(text, key, decrypt = false, isHexKey = false) {
    let keyBits = isHexKey ? hexToBits(key) : strToBits(key).slice(0, 64);
    let subkeys = generateSubkeys(keyBits);
    if (decrypt) subkeys.reverse();
    let dataBits = decrypt ? text : pad(strToBits(text));
    let resBits = [];
    for (let i = 0; i < dataBits.length; i += 64) {
        let block = dataBits.slice(i, i + 64);
        resBits = resBits.concat(desBlock(block, subkeys));
    }
    return decrypt ? bitsToStr(unpad(resBits)) : resBits;
}

function processDataBits(dataBits, keyBits, decrypt = false) {
    let subkeys = generateSubkeys(keyBits);
    if (decrypt) subkeys.reverse();
    let resBits = [];
    for (let i = 0; i < dataBits.length; i += 64) {
        let block = dataBits.slice(i, i + 64);
        resBits = resBits.concat(desBlock(block, subkeys));
    }
    return resBits;
}

function hammingDistance(b1, b2) {
    let diff = 0;
    for (let i = 0; i < b1.length; i++) if (b1[i] !== b2[i]) diff++;
    return diff;
}

function avalancheEffect() {
    let key = "Luzhetsk";
    let subkeys = generateSubkeys(strToBits(key).slice(0, 64));
    let plain1 = pad(strToBits("Data1234")).slice(0, 64);
    let plain2 = plain1.slice();
    plain2[0] ^= 1; 

    let { history: h1 } = desBlock(plain1, subkeys, true);
    let { history: h2 } = desBlock(plain2, subkeys, true);

    console.log(" Лавинный эффект (Количество измененных битов по раундам) ");
    for (let i = 0; i < 16; i++) {
        console.log(`Раунд ${i + 1}: ${hammingDistance(h1[i], h2[i])} бит(ов)`);
    }
    console.log("");
}

function testWeakKeys() {
    let weakKeyHex = "0101010101010101";
    let weakKeyBits = hexToBits(weakKeyHex);
    let plain1 = pad(strToBits("Data1234")).slice(0, 64);
    
    let subkeysWeak = generateSubkeys(weakKeyBits);
    
    console.log(" Анализ слабого ключа (0101010101010101) ");
    let allSame = true;
    for (let i = 1; i < 16; i++) {
        if (hammingDistance(subkeysWeak[0], subkeysWeak[i]) !== 0) {
            allSame = false;
            break;
        }
    }
    console.log(`Все 16 раундовых подключей одинаковы: ${allSame}`);

    let encWeak = processDataBits(plain1, weakKeyBits, false);
    let doubleEncWeak = processDataBits(encWeak, weakKeyBits, false);
    
    console.log(`Двойное шифрование слабым ключом равно исходному тексту: ${hammingDistance(plain1, doubleEncWeak) === 0}`);

    let plain2 = plain1.slice();
    plain2[0] ^= 1; 
    let { history: h1Weak } = desBlock(plain1, subkeysWeak, true);
    let { history: h2Weak } = desBlock(plain2, subkeysWeak, true);
    
    console.log(`Лавинный эффект со слабым ключом на 16 раунде: ${hammingDistance(h1Weak[15], h2Weak[15])} бит(ов)\n`);

    console.log(" Анализ полуслабых ключей (01FE01FE01FE01FE и FE01FE01FE01FE01)");
    let semiWeakKey1 = hexToBits("01FE01FE01FE01FE");
    let semiWeakKey2 = hexToBits("FE01FE01FE01FE01");
    
    let encSemi1 = processDataBits(plain1, semiWeakKey1, false);
    let decSemi2 = processDataBits(encSemi1, semiWeakKey2, false); 
    
    console.log(`Текст, зашифрованный ключом 1, расшифровывается зашифрованием ключом 2: ${hammingDistance(plain1, decSemi2) === 0}\n`);
}

function compressionTest(text, encryptedBits) {
    let bufPlain = Buffer.from(text, 'utf8');
    let bufEnc = Buffer.alloc(encryptedBits.length / 8);
    for (let i = 0; i < encryptedBits.length; i += 8) {
        let byte = 0;
        for (let j = 0; j < 8; j++) byte |= (encryptedBits[i + j] << (7 - j));
        bufEnc[i / 8] = byte;
    }
    
    let plainZipped = zlib.deflateSync(bufPlain);
    let encZipped = zlib.deflateSync(bufEnc);

    console.log(" Степень сжатия ");
    console.log(`Открытый текст до сжатия: ${bufPlain.length} байт`);
    console.log(`Открытый текст после сжатия: ${plainZipped.length} байт`);
    console.log(`Зашифрованный текст до сжатия: ${bufEnc.length} байт`);
    console.log(`Зашифрованный текст после сжатия: ${encZipped.length} байт\n`);
}

function bitsToBuffer(bits) {
    let buf = Buffer.alloc(bits.length / 8);
    for (let i = 0; i < bits.length; i += 8) {
        let byte = 0;
        for (let j = 0; j < 8; j++) {
            byte |= (bits[i + j] << (7 - j));
        }
        buf[i / 8] = byte;
    }
    return buf;
}

function main() {
    let key = "Luzhetsk";
    let text = fs.readFileSync('source.txt', 'utf8'); 
    
    let startEnc = performance.now();
    let encryptedBits = processData(text, key, false);
    let timeEnc = performance.now() - startEnc;

    let encBuffer = bitsToBuffer(encryptedBits);
    fs.writeFileSync('encrypted.bin', encBuffer);
    
    let startDec = performance.now();
    let decryptedText = processData(encryptedBits, key, true);
    let timeDec = performance.now() - startDec;

    fs.writeFileSync('decrypted.txt', decryptedText, 'utf8');

    console.log(`Файл encrypted.bin успешно сохранен!`);
    console.log(`Файл decrypted.txt успешно сохранен (для проверки)!`);
    console.log(`\n Оценка скорости (Текст: ${text.length} байт) `);
    console.log(`Зашифрование: ${timeEnc.toFixed(3)} мс`);
    console.log(`Расшифрование: ${timeDec.toFixed(3)} мс\n`);

    avalancheEffect();
    testWeakKeys();
    compressionTest(text, encryptedBits);
}

main();