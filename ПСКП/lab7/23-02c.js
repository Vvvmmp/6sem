const crypto = require('crypto');
const fs = require('fs');

const CLIENT_FILE = 'client_student.txt';

function ClientVerify(SignContext) {
    const v = crypto.createVerify('SHA256');
    this.verify = (rs, cb) => {
        console.log('[Client] Чтение скачанного файла потоком и вычисление его хеша...');
        rs.pipe(v);
        rs.on('end', () => {
            console.log('[Client] Сравнение хешей с использованием публичного ключа сервера...');
            cb(v.verify(SignContext.publicKey, SignContext.signature, 'hex'));
        });
    }
}

async function runClient() {
    console.log('[Client] Запуск клиента...\n');
    try {
        console.log('[Client] Шаг 1: Запрос содержимого файла (GET http://localhost:3000/)...');
        const res1 = await fetch('http://localhost:3000/');
        const fileData = await res1.text();
        
        console.log(`[Client] Сохранение полученных данных в локальный файл: ${CLIENT_FILE}...`);
        fs.writeFileSync(CLIENT_FILE, fileData);
        console.log('[Client] Содержимое файла: ', fileData);

        console.log('\n[Client] Шаг 2: Запрос цифровой подписи (GET http://localhost:3000/sign)...');
        const res2 = await fetch('http://localhost:3000/sign');
        
        if (res2.status === 409) {
            console.error('[Client] Ошибка 409: Нарушение протокола (файл не был запрошен).');
            return;
        }
        if (!res2.ok) throw new Error(`Server error: ${res2.status}`);

        const signContext = await res2.json();
        console.log('[Client] Публичный ключ и подпись от сервера успешно получены.');

        console.log('\n[Client] Шаг 3: Верификация (проверка) цифровой подписи...');
        const cv = new ClientVerify(signContext);
        const rs = fs.createReadStream(CLIENT_FILE);
        
        cv.verify(rs, (result) => {
            if (result) {
                console.log('Результат проверки: Подпись ВЕРНА (true).');
            } else {
                console.log('Результат проверки: Подпись НЕВЕРНА (false).');
            }
        });

    } catch (err) {
        console.error('\n[Client] Критическая ошибка:', err.message);
    }
}

runClient();