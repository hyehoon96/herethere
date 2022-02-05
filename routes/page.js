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
    // res.send('POST request to the homepage');
});

module.exports = router;
