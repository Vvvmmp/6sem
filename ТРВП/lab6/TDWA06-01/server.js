const express = require('express');
const { sql, poolPromise } = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json()); 

app.post('/api/celebrities', async (req, res) => {
    const { FullName, Nationality, ReqPhotoPath } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('FullName', sql.NVarChar(50), FullName)
            .input('Nationality', sql.NVarChar(2), Nationality)
            .input('ReqPhotoPath', sql.NVarChar(200), ReqPhotoPath)
            .query(`
                INSERT INTO Celebrities (FullName, Nationality, ReqPhotoPath)
                OUTPUT INSERTED.*
                VALUES (@FullName, @Nationality, @ReqPhotoPath)
            `);
        res.status(201).json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/celebrities', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Celebrities');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/celebrities/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Id', sql.Int, req.params.id)
            .query('SELECT * FROM Celebrities WHERE Id = @Id');
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Знаменитость не найдена' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/celebrities/:id', async (req, res) => {
    const { FullName, Nationality, ReqPhotoPath } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Id', sql.Int, req.params.id)
            .input('FullName', sql.NVarChar(50), FullName)
            .input('Nationality', sql.NVarChar(2), Nationality)
            .input('ReqPhotoPath', sql.NVarChar(200), ReqPhotoPath)
            .query(`
                UPDATE Celebrities
                SET FullName = @FullName, Nationality = @Nationality, ReqPhotoPath = @ReqPhotoPath
                OUTPUT INSERTED.*
                WHERE Id = @Id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Знаменитость не найдена' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/celebrities/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Id', sql.Int, req.params.id)
            .query('DELETE FROM Celebrities WHERE Id = @Id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Знаменитость не найдена' });
        }
        res.json({ message: 'Знаменитость успешно удалена' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер TDWA06-01 запущен на http://localhost:${PORT}`);
});