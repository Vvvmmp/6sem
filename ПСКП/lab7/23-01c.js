const crypto = require('crypto');
const fs = require('fs');

function ClientDH(serverContext) {
    const ctx = {
        p_hex: serverContext.p_hex ? serverContext.p_hex : '1111',
        g_hex: serverContext.g_hex ? serverContext.g_hex : '1',
    };
    const p = Buffer.from(ctx.p_hex, 'hex');
    const g = Buffer.from(ctx.g_hex, 'hex');
    const dh = crypto.createDiffieHellman(p, g);
    const k = dh.generateKeys();
    
    this.getContext = () => {
        return {
            p_hex: p.toString('hex'),
            g_hex: g.toString('hex'),
            key_hex: k.toString('hex')
        };
    };
    
    this.getSecret = (serverContext) => {
        const k = Buffer.from(serverContext.key_hex, 'hex');
        return dh.computeSecret(k);
    };
}

async function runClient() {
    console.log('[Client] Запуск клиента...\n');
    try {        
        console.log('[Client] Шаг 1: Запрос публичных параметров сервера (GET http://localhost:3000/)...');
        const res1 = await fetch('http://localhost:3000/');
        const serverContext = await res1.json();
        console.log('[Client] Параметры от сервера успешно получены.');
        
        console.log('\n[Client] Шаг 2: Инициализация Diffie-Hellman и генерация собственных ключей...');
        const clientDH = new ClientDH(serverContext);
        const clientContext = clientDH.getContext();
        
        console.log('[Client] Вычисление общего секрета на основе ключа сервера...');
        const clientSecret = clientDH.getSecret(serverContext);
        console.log('[Client] Общий секретный ключ успешно вычислен!');
        
        console.log('\n[Client] Шаг 3: Отправка своего публичного ключа серверу (POST http://localhost:3000/exchange)...');
        const res2 = await fetch('http://localhost:3000/exchange', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientContext)
        });

        if (!res2.ok) throw new Error(`Server error: ${res2.status}`);
        console.log('[Client] Сервер успешно принял ключ клиента.');

        console.log('\n[Client] Шаг 4: Запрос зашифрованного файла (GET http://localhost:3000/resource)...');
        const res3 = await fetch('http://localhost:3000/resource');
        if (res3.status === 409) {
            console.error('[Client] Ошибка 409: Нарушение протокола обмена!');
            return;
        }
        
        const encryptedFile = await res3.json();
        console.log('[Client] Получен зашифрованный файл и вектор инициализации (IV).');

        console.log('\n[Client] Шаг 5: Формирование ключа AES-256 и расшифровка данных...');
        const key = crypto.createHash('sha256').update(clientSecret).digest();
        const iv = Buffer.from(encryptedFile.iv, 'hex');
        
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encryptedFile.data, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        console.log('[Client] Данные успешно расшифрованы!');

        console.log('\n[Client] Шаг 6: Запись данных в файл student.txt...');
        fs.writeFileSync('student.txt', decrypted);
        console.log('Содержимое файла: ', decrypted);

    } catch (err) {
        console.error('\n[Client] Критическая ошибка:', err.message);
    }
}

runClient();