const userController = require('./user_controller');

module.exports = {
    'GET:/user': userController.getUsers,
    'POST:/user': userController.createUser,
    'PUT:/user': userController.updateUser,
    'DELETE:/user': userController.deleteUser
};