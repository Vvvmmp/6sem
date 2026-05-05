const express = require('express');
const controllerTable = require('../controllers/controllerTable');

const router = express.Router();

router.use((req, res) => {
    const routeKey = `${req.method}:${req.path}`;
    const action = controllerTable[routeKey];

    if (!action) {
        return res.status(404).json({ 
            error: 'Route not found', 
            requested: routeKey,
            available: Object.keys(controllerTable)
        });
    }

    action(req, res);
});
module.exports = router;