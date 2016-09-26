var express = require('express'); //web应用开发框架
var path = require('path'); //处理目录的对象
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials'); //express片段视图
var session    = require('express-session');
var MongoStore = require('connect-mongo')(session); 
var settings = require('./settings');
var flash = require('connect-flash');
var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();
var routes = require('./routes/index');
//var users = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use(session({
    secret: settings.cookieSecret,
    store: new MongoStore({
        url:'mongodb://localhost/'+settings.db,
    })
}));
// app.use(function(req, res, next){
// 	console.log("app.usr local");
// 	res.locals.questionList = req.session.questionList;
// 	next();
// });

app.use('/', routes);
app.use('/queslist',routes);
app.use('/quesPagelist',routes);
app.use('/search',routes);
app.listen(8008);
console.log("something happening");
/// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });
ee.setMaxListeners(5);
module.exports = app;