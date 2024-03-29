var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})
var indexRouter = require('./routes/index');
app.use('/', indexRouter);

var getCodeRouter = require('./routes/getCode');
app.use('/getCode', getCodeRouter);

var getDataRouter = require('./routes/getData');
app.use('/getData', getDataRouter);

var getCSVRouter = require('./routes/getCSV');
app.use('/getData.csv', getCSVRouter);

var getLinedCSVRouter = require('./routes/getLinedCSV');
app.use('/getLined.csv', getLinedCSVRouter);

var ImplicitGrantFlowRouter = require('./routes/ImplicitGrantFlow');
app.use('/ImplicitGrantFlow', ImplicitGrantFlowRouter);

var usersRouter = require('./routes/users');
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
