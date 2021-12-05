const express = require('express');

const router = express.Router();

//db

router.use((req, res, next) => {
    res.locals.user = null;
    res.locals.area = 'Seoul';
    next();
});

router.get('/', (req, res, next)=> {
    res.render('main', null);
});

// router.get('/mypage', (req, res) => {
//     res.render('main', { 
//         name: 'ASP',
//         isLogin: true
//     });
// });

router.post('/', function (req, res) {
    console.log(req.body.area1, req.body.area2);
    res.render('main', null);
    // res.send('POST request to the homepage');
});

module.exports = router;
