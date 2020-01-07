const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const app = express();
const JWT_SECRET = "secret";

app.use(jwt({ secret: JWT_SECRET }).unless({
    path: [
      { url: `/login` },
    ]
}));
 // parse application/json
 app.use(bodyParser.json({ limit: '50mb' }));
 // parse application/x-www-form-urlencoded
 app.use(bodyParser.urlencoded({
   extended: false,
   limit: '50mb'
 }));

router.get('/ping', async (req, res) => {
    res.send('pong');
});

router.get('/login', async (req, res) => {
    const user = req.body;
    if (user.userName === "Andres" && user.password === "Andres123") {
        res.send('ok')
    } else
        res.status(400).send('BAD CREDENTIALS');
});





app.use(router);

app.listen(8080, () => {
    console.log(`I'm Flying`);
});



