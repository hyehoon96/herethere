const express       = require('express');
const cookieParser  = require('cookie-parser');
const morgan        = require('morgan');            // 서버 요청에 따라 log 기록용
const path          = require('path');              // 파일 경로
const session       = require('express-session');   // 사용자의 데이터를 임시적으로 저장함
const database      = require('./database.js');
const bcrypt        = require('bcrypt');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
/*
  Node.js 서버의 설정(환경변수)을 받아오기 위한 dotenv 모듈 불러오기
  설정이 적용된 후에, 나머지 코드들이 실행되기 위해서 꼭 맨위에 작성해야 한다
*/
require('dotenv').config();
// const pageRouter = require('../routes/page');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.set('port', process.env.PORT || 8080);

// 데이터베이스 연결
const conn = database.init();
database.connect(conn);

// nunjucks.configure('views', {
//     express: app,       // app 객체 연결
//     watch: true,        // html 파일이 변경될 때 템플릿 엔진을 다시 렌더링함
//     autoescape:true,    // 보안설정
// });

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
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

// page router 연결
// app.use('/', pageRouter);

// error 404 처리
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

// 회원정보를 가져오는 API
app.get('/user/:id', (req, res) => {
    const id = req.params.id;
    conn.query('SELECT id, password, name, nickname FROM user WHERE id = ? AND is_deleted = "N"', id, (err, row) => {
        if (err) { console.log(err); }
        let user = row[0];
        if (!user) {
            return res.status(404).json({err: 'Unknown user'});
        }
        res.json(user);
    });
});

// 회원정보를 삭제하는 API
// 1. 테이블에서 데이터를 삭제하는 방법
// 2. 플래그를 사용하여 데이터가 삭제되었다고 표시 -> 적용!
app.delete('/user/:id', (req, res) => {
    const id = req.params.id;
    conn.query('UPDATE user SET is_deleted = "Y", deleted_date = CURRENT_TIMESTAMP WHERE id = ?', id, (err, row) => {
        if (err) { console.log(err); }
        return res.status(204).send();
    });
});

// 회원정보를 생성하는 API
// 조건1. 중복이 아닌 아이디
// 조건2. 생성 규칙을 준수하는 비밀번호
app.post('/user', (req, res) => {
    const params = [
        req.body.id.toLowerCase(), // 소문자로 변환
        req.body.password,
        req.body.name,
        req.body.nickname
    ];
    bcrypt.hash(params[1], 10, (err, hash) => {
        params[1] = hash;
        conn.query('INSERT INTO user(`id`,`password`,`name`,`nickname`) VALUES (?,?,?,?)', params, (err, row) => {
            if (err) { console.log(err); }
            return res.status(201).json({
                no: row['insertId'],
                id: params[0],
                password: params[1],
                name: params[2],
                nickname: params[3]
            });
        });
    });
});

// 아이디 유효성 검사 API
app.get('/user/checkId/:id', (req, res) => {
    const id = req.params.id;
    conn.query('SELECT id FROM user WHERE id = LOWER(?)', id, (err, row) => {
        if (err) { console.log(err); }
        return res.status(200).json({
            result: row[0] ? false : true
        });
    })
});

// todo: 서버 종료 시 데이터베이스 연결이 종료되도록 수정
process.on('SIGINT', function() {
    console.log('프로세스를 종료합니다');
    database.end(conn);
    process.exit(0);
})

module.exports = app;