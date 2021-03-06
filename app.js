const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
var compression = require('compression');
var helmet = require('helmet');
const indexRouter = require('./routes/index');
const catalogRouter = require('./routes/catalog');

const app = express();

// Настройка и подключение к БД
const mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// middlewares
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/catalog', catalogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
