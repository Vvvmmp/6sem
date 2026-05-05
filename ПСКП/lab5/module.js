const Users = require('./users.json');

const getCredential = (user) => {
    return Users.find((e) => e.user.toUpperCase() == user.toUpperCase());
};

const verPassword = (pass1, pass2) => { return pass1 == pass2; };

module.exports = {
    getCredential: getCredential,
    verPassword: verPassword
};