const express       = require('express');
const cookieParser  = require('cookie-parser');
const morgan        = require('morgan');            // 서버 요청에 따라 log 기록용
const path          = require('path');              // 파일 경로
const session       = require('express-session');   // 사용자의 데이터를 임시적으로 저장함
const database      = require('./database.js');


/*
  Node.js 서버의 설정(환경변수)을 받아오기 위한 dotenv 모듈 불러오기
  설정이 적용된 후에, 나머지 코드들이 실행되기 위해서 꼭 맨위에 작성해야 한다
*/
require('dotenv').config();
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8080);

// 데이터베이스 연결
// const conn = database.init();
// database.connect(conn);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');        
app.use('/', indexRouter);
app.use('/api/user', usersRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next)=> {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err: {};
    res.status(err.status || 500);
    res.render('error');
});

// port에서 대기
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
})



// todo: 서버 종료 시 데이터베이스 연결이 종료되도록 수정
process.on('SIGINT', function() {
    console.log('프로세스를 종료합니다');
    database.end(conn);
    process.exit(0);
})

module.exports = app;