const fs = require('fs');
const { performance } = require('perf_hooks');
const xlsx = require('xlsx');

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

function zigzagEncrypt(text, rows, cols) {
    const blockSize = rows * cols;
    while (text.length % blockSize !== 0) {
        text += ' ';
    }

    let result = '';
    for (let blockStart = 0; blockStart < text.length; blockStart += blockSize) {
        const block = text.slice(blockStart, blockStart + blockSize);
        
        for (let c = 0; c < cols; c++) {
            if (c % 2 === 0) {
                for (let r = 0; r < rows; r++) result += block[r * cols + c];
            } else {
                for (let r = rows - 1; r >= 0; r--) result += block[r * cols + c];
            }
        }
    }
    return result;
}

function zigzagDecrypt(text, rows, cols) {
    const blockSize = rows * cols;
    let result = '';

    for (let blockStart = 0; blockStart < text.length; blockStart += blockSize) {
        const block = text.slice(blockStart, blockStart + blockSize);
        const grid = Array.from({ length: rows }, () => Array(cols).fill(''));
        
        let index = 0;
        for (let c = 0; c < cols; c++) {
            if (c % 2 === 0) {
                for (let r = 0; r < rows; r++) grid[r][c] = block[index++];
            } else {
                for (let r = rows - 1; r >= 0; r--) grid[r][c] = block[index++];
            }
        }
        
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                result += grid[r][c];
            }
        }
    }
    return result; 
}

function getColumnOrder(keyword) {
    const arr = keyword.toLowerCase().split('').map((char, index) => ({ char, index }));
    arr.sort((a, b) => a.char.localeCompare(b.char));
    return arr.map(item => item.index);
}

function columnarEncrypt(text, keyword) {
    const cols = keyword.length;
    while (text.length % cols !== 0) text += ' ';
    
    const rows = text.length / cols;
    const order = getColumnOrder(keyword);
    let result = '';
    
    for (let c of order) {
        for (let r = 0; r < rows; r++) {
            result += text[r * cols + c];
        }
    }
    return result;
}

function columnarDecrypt(text, keyword) {
    const cols = keyword.length;
    const rows = text.length / cols;
    const order = getColumnOrder(keyword);
    const grid = Array.from({ length: rows }, () => Array(cols).fill(''));
    
    let index = 0;
    for (let c of order) {
        for (let r = 0; r < rows; r++) {
            grid[r][c] = text[index++];
        }
    }
    
    let result = '';
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) result += grid[r][c];
    }
    return result;
}

function multipleEncrypt(text, key1, key2) {
    const commonMultiple = key1.length * key2.length;
    while (text.length % commonMultiple !== 0) {
        text += ' ';
    }

    const firstPass = columnarEncrypt(text, key1);
    return columnarEncrypt(firstPass, key2);
}

function multipleDecrypt(text, key1, key2) {
    const firstPass = columnarDecrypt(text, key2);
    return columnarDecrypt(firstPass, key1);
}

function calculateFrequencies(text) {
    const counts = {};
    let total = 0;
    for (let char of text.toLowerCase()) {
        if (ALPHABET.includes(char)) {
            counts[char] = (counts[char] || 0) + 1;
            total++;
        }
    }
    
    const frequencies = {};
    for (let char of ALPHABET) {
        frequencies[char] = total > 0 ? Number(((counts[char] || 0) / total * 100).toFixed(2)) : 0;
    }
    return frequencies;
}

function exportToExcel(origText, zigzagText, multipleText) {
    const origFreq = calculateFrequencies(origText);
    const zigzagFreq = calculateFrequencies(zigzagText);
    const multFreq = calculateFrequencies(multipleText);

    const data = ALPHABET.split('').map(char => ({
        'Символ': char,
        'Исходный текст (%)': origFreq[char],
        'Зигзаг (%)': zigzagFreq[char],
        'Множественная (%)': multFreq[char]
    }));

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Гистограммы (Перестановка)");

    xlsx.writeFile(workbook, 'histograms_lab5.xlsx');
    console.log('\nhistograms_lab5.xlsx created! ');
}

function main() {
    
    const text = fs.readFileSync('source.txt', 'utf8'); 
    
    console.log(`Объем исходного текста: ${text.length} символов.`);

    const rows = 5;
    const cols = 10;
    
    const key1 = "Luzhetskiy";
    const key2 = "Vladislav";

    let start = performance.now();
    const zigzagEncrypted = zigzagEncrypt(text, rows, cols);
    let encryptTimeZigzag = performance.now() - start;

    start = performance.now();
    const zigzagDecrypted = zigzagDecrypt(zigzagEncrypted, rows, cols);
    let decryptTimeZigzag = performance.now() - start;

    console.log(`\nМаршрутная перестановка (Зигзаг ${rows}x${cols})`);
    console.log(`Время зашифрования: ${encryptTimeZigzag.toFixed(3)} мс`);
    console.log(`Время расшифрования: ${decryptTimeZigzag.toFixed(3)} мс`);

    start = performance.now();
    const multEncrypted = multipleEncrypt(text, key1, key2);
    let encryptTimeMult = performance.now() - start;

    start = performance.now();
    const multDecrypted = multipleDecrypt(multEncrypted, key1, key2);
    let decryptTimeMult = performance.now() - start;

    console.log(`\nМножественная перестановка (Ключи: ${key1}, ${key2})`);
    console.log(`Время зашифрования: ${encryptTimeMult.toFixed(3)} мс`);
    console.log(`Время расшифрования: ${decryptTimeMult.toFixed(3)} мс`);

    exportToExcel(text, zigzagEncrypted, multEncrypted);
}

main();