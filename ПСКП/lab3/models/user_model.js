let users = [];

exports.getAll = () => users;

exports.getById = (id) => users.find(u => u.id === id);

exports.createUser = (data) => {
    const newUser = { id: Date.now().toString(), ...data };
    users.push(newUser);
    return newUser;
};

exports.updateUser = (id, data) => {
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
        users[index] = { ...users[index], ...data };
        return users[index];
    }
    return null;
};

exports.deleteUser = (id) => {
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
    return null;
};