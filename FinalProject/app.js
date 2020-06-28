const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/view')

const DisneySongRouter = require('./router/DisneySongRouter');
app.use(DisneySongRouter);

module.exports = app;