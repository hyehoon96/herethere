const express = require('express');

const router = express.Router();

//db

router.use((req, res, next) => {
    res.locals.user = null;
    res.locals.area = 'Seoul';
    next();
});

router.get('/', (req, res, next)=> {
    res.render('home', null);
});

router.get('/search', (req, res, next)=> {
    console.log('get search');
    res.render('home', {
        count: req.body.count,
        area: req.body.purpose
    });
});

router.post('/search', function (req, res) {
    console.log('post search', req.body.count);
    res.render('home', {
        count: req.body.count,
        area: req.body.purpose,
        page: 'search'
    });
});

router.get('/register', (req, res, next)=> {
    console.log('register');
    res.render('register', null);
});

router.get('/login', (req, res, next)=> {
    console.log('login');
    res.render('login', null);
});

module.exports = router;