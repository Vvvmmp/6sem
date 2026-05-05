const fs = require('fs');
const { performance } = require('perf_hooks');
const xlsx = require('xlsx');

const ALPHABET = 'абвгдеёжзійклмнопрстуўфхцчшыьэюя';
const N = ALPHABET.length;

function caesarCipher(text, k, encrypt = true) {
    let result = '';
    const shift = encrypt ? k : -k;
    
    for (let char of text.toLowerCase()) {
        const idx = ALPHABET.indexOf(char);
        if (idx !== -1) {
            let newIdx = (idx + shift) % N;
            if (newIdx < 0) newIdx += N;
            result += ALPHABET[newIdx];
        } else {
            result += char;
        }
    }
    return result;
}

function buildTrithemiusTable(keyword) {
    const uniqueChars = [];
    const combined = keyword.toLowerCase() + ALPHABET;
    
    for (let char of combined) {
        if (ALPHABET.includes(char) && !uniqueChars.includes(char)) {
            uniqueChars.push(char);
        }
    }
    
    const table = [];
    for (let i = 0; i < 32; i += 8) {
        table.push(uniqueChars.slice(i, i + 8));
    }
    return table;
}

function trithemiusCipher(text, keyword, encrypt = true) {
    const table = buildTrithemiusTable(keyword);
    let result = '';
    const shift = encrypt ? 1 : -1;
    
    for (let char of text.toLowerCase()) {
        if (ALPHABET.includes(char)) {
            for (let r = 0; r < 4; r++) {
                const c = table[r].indexOf(char);
                if (c !== -1) {
                    let newR = (r + shift) % 4;
                    if (newR < 0) newR += 4;
                    result += table[newR][c];
                    break;
                }
            }
        } else {
            result += char;
        }
    }
    return result;
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

function exportToExcel(originalText, encryptedCaesar, encryptedTrithemius) {
    const origFreq = calculateFrequencies(originalText);
    const caesarFreq = calculateFrequencies(encryptedCaesar);
    const triFreq = calculateFrequencies(encryptedTrithemius);

    const data = [];
    for (let char of ALPHABET) {
        data.push({
            'Символ': char,
            'Исходный текст (%)': origFreq[char],
            'Цезарь k=21 (%)': caesarFreq[char],
            'Трисемус (%)': triFreq[char]
        });
    }

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Гистограммы частот");

    xlsx.writeFile(workbook, 'histograms.xlsx');
    console.log('\nФайл histograms.xlsx успешно создан!');
}

function main() {
    let text = '';
        text = fs.readFileSync('input_bel.txt', 'utf8');
  

    const kCaesar = 21;
    const keywordTrithemius = "Уладзіслаў";

    let start = performance.now();
    const encryptedCaesar = caesarCipher(text, kCaesar, true);
    let encryptTimeCaesar = (performance.now() - start) / 1000;

    start = performance.now();
    const decryptedCaesar = caesarCipher(encryptedCaesar, kCaesar, false);
    let decryptTimeCaesar = (performance.now() - start) / 1000;

    console.log(`Цезарь зашифрование: ${encryptTimeCaesar.toFixed(5)} сек`);
    console.log(`Цезарь расшифрование: ${decryptTimeCaesar.toFixed(5)} сек`);

    start = performance.now();
    const encryptedTrithemius = trithemiusCipher(text, keywordTrithemius, true);
    let encryptTimeTri = (performance.now() - start) / 1000;

    start = performance.now();
    const decryptedTrithemius = trithemiusCipher(encryptedTrithemius, keywordTrithemius, false);
    let decryptTimeTri = (performance.now() - start) / 1000;

    console.log(`\nТрисемус зашифрование: ${encryptTimeTri.toFixed(5)} сек`);
    console.log(`Трисемус расшифрование: ${decryptTimeTri.toFixed(5)} сек`);

    exportToExcel(text, encryptedCaesar, encryptedTrithemius);
}

main();