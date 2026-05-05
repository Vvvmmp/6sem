const app = require('express')();
const passport = require('passport');
const DigestStrategy = require('passport-http').DigestStrategy;
const { getCredential, verPassword } = require('./module');

const session = require('express-session')(
    {
        resave: false,
        saveUninitialized: false,
        secret: '12345678'
    }
);

passport.use(new DigestStrategy({qop:'auth'}, (user, done) => {
    let rc = null;
    let cr = getCredential(user);
    if (!cr) rc = done(null, false);
    else rc = done(null, cr.user, cr.password);
    return rc;
}, (params, done) => {
    console.log('params = ', params);
    done(null, true);
}
));

passport.serializeUser((user, done) => {
    console.log('serialize', user);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log('deserialize', user);
    done(null, user);
});

app.use(session);
app.use(passport.initialize());
app.use(passport.session());

const loginMiddleware = passport.authenticate('digest', { session: true });

app.get('/login', loginMiddleware, (req, res) => {
    res.redirect('/resource');
});

app.get('/resource', (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/login');
    res.send('resource');
})

app.get('/logout', (req, res) => {
    req.logout(() => {
        req.session.destroy(() => {
            res.status(401).send('You have been logged out');
        });
    });
});

app.use((req, res) => res.status(404).send('404 Not Found'));

app.listen(3000, () => console.log('Server at running http://localhost:3000'));