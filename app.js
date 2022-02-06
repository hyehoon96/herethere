const express       = require('express');
const cookieParser  = require('cookie-parser');
const morgan        = require('morgan');            // 서버 요청에 따라 log 기록용
const path          = require('path');              // 파일 경로
const session       = require('express-session');   // 사용자의 데이터를 임시적으로 저장함
const nunjucks      = require('nunjucks');
const database      = require('./database.js');
const bcrypt        = require('bcrypt');

/*
  Node.js 서버의 설정(환경변수)을 받아오기 위한 dotenv 모듈 불러오기
  *** 꼭 맨위에 작성해야한다 *** (설정이 적용된 후에, 나머지 코드들이 실행되기 위해서)
*/
require('dotenv').config();
const pageRouter = require('./routes/page');

const app = express();
app.set('port', process.env.PORT || 8001);

// 데이터베이스 연결
const conn = database.init();
database.connect(conn);

app.set('view engine', 'html'); // DB등의 내용을 HTML에 보여줄 수 있도록 하는 엔진, html 내부에서 반복문, 조건문을 사용할 수 있게 한다.
nunjucks.configure('views', {
    express: app,       // app 객체 연결
    watch: true,        // html 파일이 변경될 때 템플릿 엔진을 다시 렌더링함
    autoescape:true,    // 보안설정
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public'))); // express.static: express에서 정적 파일 제공
app.use(express.static(path.join(__dirname, "src")));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))

app.use(express.json());
//app.use(express.urlencoded({extended: false}));
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

// 회원정보를 가져오는 API
app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    conn.query('SELECT * FROM user WHERE id = ?', id, (err, row) => {
        if (err) { console.log(err); }
        let user = row[0];
        if (!user) {
            return res.status(404).json({err: 'Unknown user'});
        }
        res.json(user);
    });
});

// 회원정보를 삭제하는 API
app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    conn.query('DELETE FROM user WHERE id = ?', id, (err, row) => {
        if (err) { console.log(err); }
        let user = row[0];
        if (!user) {
            return res.status(404).json({err: 'Unknown user'});
        }
        return res.status(204).send();
    });
});

// 회원정보를 생성하는 API
app.post('/users', (req, res) => {
    console.log(req.body);
    const param = [
        req.body.id,
        req.body.password,
        req.body.name,
        req.body.nickname
    ];
    bcrypt.hash(param[1], 10, (err, hash) => {
        param[1] = hash;
        conn.query('INSERT INTO user(`id`,`password`,`name`,`nickname`) VALUES (?,?,?,?)', param, (err, row) => {
            if (err) { console.log(err); }
            return res.status(201).json(row);
        });
    });
});

// page router 연결
app.use('/', pageRouter);

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