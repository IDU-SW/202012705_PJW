const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret : 'Secret Key',
    resave : false,
    saveUninitialized : false
}));

// 파비콘 무시
app.use('/favicon.ico',  () => {});

app.set('view engine', 'ejs'); //뷰 엔진 ejs 사용
app.set('views', __dirname + '/view')

const DisneySongRouter = require('./router/DisneySongRouter');
app.use(DisneySongRouter);

module.exports = app;