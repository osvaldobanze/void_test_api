 

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const router = require('./routes/routes.js');                 
const notFound = require('./middlewares/notFoundPage.js');
const error = require('./middlewares/errorPage.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/status/check', (req, res) => res.json({ ok: 'Tudo apostos correndo bem!' }));
app.use('/api', router);

app.use(notFound);
app.use(error);

module.exports = app; 
