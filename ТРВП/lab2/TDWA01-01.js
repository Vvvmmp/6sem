const http = require('http');

let storedJSON = null;

function calculate(op, x, y) {
    switch (op) {
        case "add": return x + y;
        case "sub": return x - y;
        case "mul": return x * y;
        case "div": return y !== 0 ? x / y : null;
        default: return null;
    }
}

const server = http.createServer((req, res) => {

    if (req.url !== '/NGINX-test') {
        res.writeHead(404);
        return res.end();
    }

    if (req.method === 'GET') {
        if (!storedJSON) {
            res.writeHead(404);
            return res.end();
        }

        storedJSON.result = calculate(storedJSON.op, storedJSON.x, storedJSON.y);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(storedJSON));
    }

    if (req.method === 'POST') {
        if (storedJSON) {
            res.writeHead(409);
            return res.end();
        }

        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const data = JSON.parse(body);
            storedJSON = {
                op: data.op,
                x: data.x,
                y: data.y,
                result: calculate(data.op, data.x, data.y)
            };

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(storedJSON));
        });
        return;
    }

    if (req.method === 'PUT') {
        if (!storedJSON) {
            res.writeHead(404);
            return res.end();
        }

        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const data = JSON.parse(body);
            storedJSON = {
                op: data.op,
                x: data.x,
                y: data.y,
                result: calculate(data.op, data.x, data.y)
            };

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(storedJSON));
        });
        return;
    }

    if (req.method === 'DELETE') {
        if (!storedJSON) {
            res.writeHead(404);
            return res.end();
        }

        storedJSON = null;
        res.writeHead(200);
        return res.end();
    }

    res.writeHead(405);
    res.end();
});

server.listen(40000);
console.log('TDWA01-01 http://localhost:40000/NGINX-test');
