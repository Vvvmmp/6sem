const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('./db');

const { Faculty, Pulpit, Subject, Auditorium_type, Auditorium } = db.models;

const modelMap = {
    'faculties': Faculty,
    'pulpits': Pulpit,
    'subjects': Subject,
    'auditoriumstypes': Auditorium_type,
    'auditoriums': Auditorium,
    'auditorims': Auditorium 
};

const sendJson = (res, code, data) => {
    res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
};

const getBody = (req) => new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => resolve(body ? JSON.parse(body) : {}));
});

const server = http.createServer(async (req, res) => {
    const url = req.url.split('?')[0].replace(/\/$/, '');
    const parts = url.split('/'); 

    try {
        if (req.method === 'GET' && (url === '' || url === '/')) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            return fs.createReadStream('./index.html').pipe(res);
        }

        if (parts[1] === 'api' && modelMap[parts[2]]) {
            const Model = modelMap[parts[2]];
            const pkField = Model.primaryKeyAttribute;

            switch (req.method) {
                case 'GET':
                    return sendJson(res, 200, await Model.findAll());

                case 'POST':
                    const postData = await getBody(req);
                    return sendJson(res, 201, await Model.create(postData));

                case 'PUT':
                    const putData = await getBody(req);
                    const id = putData[pkField];
                    await Model.update(putData, { where: { [pkField]: id } });
                    return sendJson(res, 200, await Model.findByPk(id));

                case 'DELETE':
                    const delId = decodeURIComponent(parts[3]);
                    const target = await Model.findByPk(delId);
                    if (!target) return sendJson(res, 404, { error: 'Not found' });
                    await target.destroy();
                    return sendJson(res, 200, target);

                default:
                    sendJson(res, 405, { error: 'Method not allowed' });
            }
        } else {
            sendJson(res, 404, { error: 'Invalid API endpoint' });
        }
    } catch (e) {
        sendJson(res, 400, { error: e.message });
    }
});

db.init().then(() => {
    server.listen(3000, () => console.log('Server running on port 3000'));
});