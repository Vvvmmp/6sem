const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { getCredential, verPassword } = require('./module');

const app = express();

const session = require('express-session')(
    {
        resave: false,
        saveUninitialized: false,
        secret: '12345678'
    }
);

app.use(session);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('static'));

const loginMiddleware = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/login');
};

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'login.html'));
});

app.post('/login', (req, res) => {
    const {username, password} = req.body;
    const user = getCredential(username);

    if (user && verPassword(user.password, password)) {
        req.session.user = username;
        res.redirect('/resource');
    }
    else{
        res.send('invalid credential');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.send('You have been logged out');
    });
});

app.get('/resource', loginMiddleware, (req, res) => {
    res.send('resource');
});

app.use((req, res) => res.status(404).send('404 Not Found'));

app.listen(3000, () => console.log('Server at running http://localhost:3000'));