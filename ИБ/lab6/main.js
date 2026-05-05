const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

class Rotor {
    constructor(wiring, name) {
        this.wiring = wiring;
        this.name = name;
        this.position = 0;
    }

    setPosition(char) {
        this.position = ALPHABET.indexOf(char.toUpperCase());
    }

    step() {
        this.position = (this.position + 1) % 26;
    }

    forward(c) {
        let shift = (c + this.position) % 26;
        let mapped = ALPHABET.indexOf(this.wiring[shift]);
        let out = (mapped - this.position + 26) % 26;
        return out;
    }

    backward(c) {
        let shift = (c + this.position) % 26;
        let charInWiring = ALPHABET[shift];
        let mapped = this.wiring.indexOf(charInWiring);
        let out = (mapped - this.position + 26) % 26;
        return out;
    }
}

class Reflector {
    constructor(wiring) {
        this.wiring = wiring;
    }
    reflect(c) {
        return ALPHABET.indexOf(this.wiring[c]);
    }
}

class EnigmaLabVariant6 {
    constructor() {
        this.L = new Rotor('AJDKSIRUXBLHWTMCQGZNPYFVOE', 'II');
        this.M = new Rotor('FSOKANUERHMBTIYCWLQPZXVGJD', 'Gamma');
        this.R = new Rotor('ESOVPZJAYQUIRHXLNFTGKDCMWB', 'IV');
        this.Ref = new Reflector('FVPJIAOYEDRZXWGCTKUQSBNMHL');
    }

    setPositions(l, m, r) {
        this.L.setPosition(l);
        this.M.setPosition(m);
        this.R.setPosition(r);
    }

    encryptChar(char) {
        let c = ALPHABET.indexOf(char.toUpperCase());
        if (c === -1) return char;

        c = this.R.forward(c);
        c = this.M.forward(c);
        c = this.L.forward(c);
        
        c = this.Ref.reflect(c);
        
        c = this.L.backward(c);
        c = this.M.backward(c);
        c = this.R.backward(c);

        let encryptedChar = ALPHABET[c];

        this.R.step();
        this.M.step();
        this.L.step();

        return encryptedChar;
    }

    encrypt(text) {
        let result = '';
        for (let char of text) {
            if (ALPHABET.includes(char.toUpperCase())) {
                result += this.encryptChar(char);
            }
        }
        return result;
    }
}

function main() {
    const enigma = new EnigmaLabVariant6();
    const text = "AA";
    
    const settings = [ 
        ['A', 'A', 'A'], ['Q', 'W', 'E'], ['R', 'T', 'Y'], 
        ['I', 'B', 'M'], ['S', 'E', 'C']
    ];

    console.log(`Исходный текст: ${text}\n`);
    console.log("Таблица зашифрованных сообщений:");
    
    settings.forEach((pos, index) => {
        enigma.setPositions(pos[0], pos[1], pos[2]);
        const encrypted = enigma.encrypt(text);
        console.log(`${index + 1}. Позиция [${pos.join('-')}]: ${encrypted}`);
        
        enigma.setPositions(pos[0], pos[1], pos[2]);
        const decrypted = enigma.encrypt(encrypted);
        if (decrypted !== text) console.error("Ошибка расшифровки!");
    });
}

main();