const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwtExpress = require('express-jwt');
const jwt = require('jsonwebtoken');
const app = express();
const JWT_SECRET = "secret";
const JWT_TIMEOUT = 60;
const randtoken = require('rand-token');
const  refreshTokens = {} 

app.use(jwtExpress({ secret: JWT_SECRET }).unless({
    path: [
      { url: `/login` },
      { url: `/token` },
    ]
}));
 // parse application/json
 app.use(bodyParser.json());
 // parse application/x-www-form-urlencoded
 app.use(bodyParser.urlencoded({extended: false}));

router.get('/ping', async (req, res) => {
    res.send('pong');
});

router.get('/login', async (req, res) => {
    const user = req.body;
    if (user.userName === "Andres" && user.password === "Andres123") {
        const token = jwt.sign(
            { username: user.userName, role: 'admin' },
            JWT_SECRET,
            { expiresIn: JWT_TIMEOUT }
        );
        const refreshToken = randtoken.uid(256);
        refreshTokens[refreshToken] = user.userName;
        res.json({token: token, refreshToken: refreshToken}) 
    } else
        res.status(400).send('BAD CREDENTIALS');
});

router.get('/token', async (req, res) => {
    const user = req.body;
    if ((user.refreshToken in refreshTokens) && refreshTokens[user.refreshToken] === user.userName) {
        delete refreshTokens[user.refreshToken];
        const token = jwt.sign(
            { username: user.userName, role: 'admin' },
            JWT_SECRET,
            { expiresIn: JWT_TIMEOUT }
        );
        const refreshToken = randtoken.uid(256);
        refreshTokens[refreshToken] = user.userName;
        res.json({ token, refreshToken }) 
    } else
        res.send(401);
});





app.use(router);

app.listen(8080, () => {
    console.log(`I'm Flying`);
});



