const userModel = require('../models/user_model');

exports.getUsers = (req, res) => {
    res.json(userModel.getAll());
};

exports.createUser = (req, res) => {
    const user = userModel.createUser(req.body);
    res.status(201).json(user);
};  

exports.updateUser = (req, res) => {
    const id = req.query.id; 
    const updated = userModel.updateUser(id, req.body);
    updated ? res.json(updated) : res.status(404).json({ error: 'Not found' });
};

exports.deleteUser = (req, res) => {
    const id = req.query.id;
    const deleted = userModel.deleteUser(id);
    deleted ? res.json({ message: 'Deleted', user: deleted }) : res.status(404).json({ error: 'Not found' });
};