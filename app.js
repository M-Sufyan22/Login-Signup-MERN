require('dotenv').config();
const express = require('express');
require('./db/config');
const path = require('path');
const router = require('./router/router');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const static_path = path.join(__dirname, 'template');
const views_path = path.join(__dirname, 'template', 'views');
const partial_path = path.join(__dirname, 'template', 'partial');

app.use(express.static(static_path));
app.set('view engine', 'hbs');
app.set('views', views_path);
hbs.registerPartials(partial_path);

app.use(router);


app.listen(PORT, () => console.log(`your app is running on port ${PORT}, http://localhost:${PORT}`));