var express = require('express');
var app = (module.exports = express());

var session = require("express-session");
var redis = require('redis');
var redisStore = require('connect-redis')(session);

const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const hpp = require('hpp');
const logger = require('./logger');

(() => {
    const ENV = process.env.NODE_ENV; // NODE_ENV를 변수에 저장
    if (!ENV || (ENV !== "development" && ENV !== "test" && ENV !== "production")) // ENV가 유효하지 않은 모드인지 검사
        throw new Error("Unknown NODE_ENV"); // 유효하지 않다면 throwing
    require('dotenv').config({
        path: path.join(__dirname, ENV + ".env") // 모드에 따라 로딩되는 환경변수 파일 다름
    });
    console.log(ENV + " 모드에서 실행중");
})();

const database = require('./database.js');
const webSocket = require('./socket.js');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var roomRouter = require('./routes/room');
var authRouter = require('./routes/auth');
var inquiryRouter = require('./routes/inquiry');
var historyRouter = require('./routes/history');

const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD,
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8080);

if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
    app.use(helmet());
    app.use(hpp());
} else {
    app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

const sessionMiddleware = session({
    key: "session_cookie_name",
    secret: "session_cookie_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 // 쿠키 유효기간 60분
        //secure: true // https를 적용할 때 true로 변경
    },
    proxy: process.env.NODE_ENV === 'production' ? true : false, // https 적용을 위해 노드 서버 앞에 다른 서버를 둔 경우 true
    store: new redisStore({ client: redisClient }),
    
})

app.use(sessionMiddleware);

app.use('/', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/room', roomRouter);
app.use('/api/auth', authRouter);
app.use('/api/inquiry', inquiryRouter);
app.use('/api/history', historyRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    logger.error(error.message);
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err: {};
    return res.status(err.status || 500);
    // res.render('error');
});

// 포트에서 대기
const server = app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
})
webSocket(server, app, sessionMiddleware);
