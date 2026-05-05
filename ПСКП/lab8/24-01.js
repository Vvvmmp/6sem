const express = require('express');
const { createClient } = require('webdav');
const multer = require('multer');

const app = express();
const port = 3000;

const webdavUrl = 'https://webdav.yandex.ru'; 
const client = createClient(webdavUrl, {
    username: '',
    password: '' 
});


const upload = multer({ storage: multer.memoryStorage() });

async function exists(path) {
    try {
        await client.stat(path);
        return true;
    } catch (err) {
        return false;
    }
}

app.post('/md/:dir', async (req, res) => {
    const dir = '/' + req.params.dir;
    if (await exists(dir)) return res.status(408).send('Directory already exists');
    try {
        await client.createDirectory(dir);
        res.send('Directory created');
    } catch (err) {
        console.error("ошибка webdav:", err.response ? err.response.statusText : err.message);
        res.status(408).send('Error creating directory');
    }
});

app.post('/rd/:dir', async (req, res) => {
    const dir = '/' + req.params.dir;
    if (!(await exists(dir))) return res.status(408).send('Directory not found');
    try {
        await client.deleteFile(dir);
        res.send('Directory deleted');
    } catch (err) {
        res.status(408).send('Error deleting directory');
    }
});

app.post('/up/:file', upload.single('file'), async (req, res) => {
    const file = '/' + req.params.file;
    if (!req.file) return res.status(400).send('No file uploaded');
    try {
        await client.putFileContents(file, req.file.buffer, { overwrite: true });
        res.send('File uploaded');
    } catch (err) {
        res.status(408).send('Error writing file');
    }
});

app.post('/down/:file', async (req, res) => {
    const file = '/' + req.params.file;
    if (!(await exists(file))) return res.status(404).send('File not found');
    try {
      
        res.setHeader('Content-Disposition', `attachment; filename="${req.params.file}"`);
        
        const stream = client.createReadStream(file);
        stream.pipe(res);
    } catch (err) {
        res.status(500).send('Download error');
    }
});

app.post('/del/:file', async (req, res) => {
    const file = '/' + req.params.file;
    if (!(await exists(file))) return res.status(404).send('File not found');
    try {
        await client.deleteFile(file);
        res.send('File deleted');
    } catch (err) {
        res.status(500).send('Error deleting file');
    }
});

app.post('/copy/:src/:dest', async (req, res) => {
    const src = '/' + req.params.src;
    const dest = '/' + req.params.dest;
    if (!(await exists(src))) return res.status(404).send('Source file not found');
    try {
        await client.copyFile(src, dest);
        res.send('File copied');
    } catch (err) {
        res.status(408).send('Error writing/copying file');
    }
});

app.post('/move/:src/:dest', async (req, res) => {
    const src = '/' + req.params.src;
    const dest = '/' + req.params.dest;
    if (!(await exists(src))) return res.status(404).send('Source file not found');
    try {
        await client.moveFile(src, dest);
        res.send('File moved');
    } catch (err) {
        res.status(408).send('Error writing/moving file');
    }
});

app.listen(port, () => {
    console.log(`Server 24-01 running at http://localhost:${port}`);
});