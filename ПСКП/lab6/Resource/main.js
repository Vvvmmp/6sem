let https = require('https');
let fs = require('fs');

let options = {
    key: fs.readFileSync('LAB.key'),
    cert: fs.readFileSync('LAB.crt')
};

https.createServer(options, (req, res) => {
    console.log('hello from https');
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    res.end('Resource: LVK, CA: SDV');
}).listen(3443);

console.log('Сервер запущен. Откройте в браузере: https://LAB22-LVK:3443');


//winpty openssl genrsa -out LAB.key 2048

//winpty openssl req -new -key LAB.key -out LAB.csr -sha256 -config LAB.cfg