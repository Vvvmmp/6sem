const fs = require('fs');

function readWin1251(filename) {
    const buffer = fs.readFileSync(filename);
    const decoder = new TextDecoder('windows-1251');
    return decoder.decode(buffer);
}

function cleanText(text, isRu) {
    let result = '';
    const lowerText = text.toLowerCase();
    for (let char of lowerText) {
        if (isRu) {
            if (/[а-яё0-9 ]/.test(char)) result += char;
        } else {
            if (/[a-z0-9 ]/.test(char)) result += char;
        }
    }
    return result;
}

function calculateProbabilities(text) {
    const counts = {};
    const totalChars = text.length;
    for (let char of text) {
        counts[char] = (counts[char] || 0) + 1;
    }
    const probabilities = {};
    for (let char in counts) {
        probabilities[char] = counts[char] / totalChars;
    }
    return probabilities;
}

function calculateEntropy(probabilities) {
    let entropy = 0;
    for (let char in probabilities) {
        const p = probabilities[char];
        if (p > 0) entropy -= p * Math.log2(p);
    }
    return entropy;
}

function textToBinary(text, isRu) {
    let binaryStr = '';
    if (isRu) {
        for (let i = 0; i < text.length; i++) {
            let code = text.charCodeAt(i);
            let byte;
            if (code >= 0x0410 && code <= 0x044F) {
                byte = code - 0x0350; // А-я
            } else if (code === 0x0401) {
                byte = 168; // Ё
            } else if (code === 0x0451) {
                byte = 184; // ё
            } else {
                byte = code & 0xFF; // Цифры и пробел
            }
            binaryStr += byte.toString(2).padStart(8, '0');
        }
    } else {
        for (let i = 0; i < text.length; i++) {
            binaryStr += (text.charCodeAt(i) & 0xFF).toString(2).padStart(8, '0');
        }
    }
    return binaryStr;
}

function calculateConditionalEntropy(pError) {
    if (pError <= 0 || pError >= 1) return 0;
    const q = 1 - pError;
    return -(pError * Math.log2(pError) + q * Math.log2(q));
}

function saveToCSV(probabilities, filename) {
    let csvContent = "\uFEFFСимвол;Вероятность\n";
    const sortedChars = Object.keys(probabilities).sort((a, b) => probabilities[b] - probabilities[a]);
    for (let char of sortedChars) {
        let safeChar = char === ' ' ? '(space)' : char;
        let probStr = probabilities[char].toFixed(10).replace('.', ',');
        csvContent += `"${safeChar}";${probStr}\n`;
    }
    fs.writeFileSync(filename, csvContent, 'utf8');
}

const rawTextRu = readWin1251('ru.txt');
const rawTextEn = fs.readFileSync('eng.txt', 'utf8');

const textRu = cleanText(rawTextRu, true);
const textEn = cleanText(rawTextEn, false);

const fioRaw = "Лужецкий Владислав Константинович";
const fioEngRaw = "Luzhetskiy Vladislav Konstantinovich";

const fio = cleanText(fioRaw, true);
const fio_eng = cleanText(fioEngRaw, false);

console.log("--- ПУНКТ А ---");
const probRu = calculateProbabilities(textRu);
const entropyRu = calculateEntropy(probRu);
console.log(`Энтропия RU: ${entropyRu.toFixed(4)} бит/симв`);
saveToCSV(probRu, 'prob_ru.csv');

const probEn = calculateProbabilities(textEn);
const entropyEn = calculateEntropy(probEn);
console.log(`Энтропия EN: ${entropyEn.toFixed(4)} бит/симв`);
saveToCSV(probEn, 'prob_eng.csv');

console.log("\n--- ПУНКТ Б ---");
const binaryFullRu = textToBinary(textRu, true);
const probBin = calculateProbabilities(binaryFullRu);
const entropyBin = calculateEntropy(probBin);
console.log(`Энтропия бинарного алфавита: ${entropyBin.toFixed(4)} бит/бит`);

console.log("\n--- ПУНКТ В ---");
const kText = fio.length;
const infoText = entropyRu * kText;
console.log(`RUS Инфо (текст, ${kText} симв.): ${infoText.toFixed(4)} бит`);

const binaryFio = textToBinary(fio, true);
const kBin = binaryFio.length;
const infoBin = entropyBin * kBin;
console.log(`RUS Инфо (бинарный, ${kBin} бит): ${infoBin.toFixed(4)} бит`);

const kText_eng = fio_eng.length;
const infoText_eng = entropyEn * kText_eng;
console.log(`ENG Инфо (текст, ${kText_eng} симв.): ${infoText_eng.toFixed(4)} бит`);

const binaryFio_eng = textToBinary(fio_eng, false);
const kBin_eng = binaryFio_eng.length;
const infoBin_eng = entropyBin * kBin_eng;
console.log(`ENG Инфо (бинарный, ${kBin_eng} бит): ${infoBin_eng.toFixed(4)} бит`);

console.log("\n--- ПУНКТ Г ---");
const errorProbs = [0.1, 0.5, 1.0];
errorProbs.forEach(p => {
    const hYx = calculateConditionalEntropy(p);
    const hEffective = 1 - hYx;
    const infoError = hEffective * kBin;
    console.log(`p = ${p}: H(Y|X) = ${hYx.toFixed(4)}, He = ${hEffective.toFixed(4)}, I = ${infoError.toFixed(4)} бит`);
});