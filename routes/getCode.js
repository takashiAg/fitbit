var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if (!("code" in req.query))
        next(new Error('no code'))
    const code = req.query.code
    res.render('getCode', {code: code});
}, function (err, req, res, next) {
    res
        .status(400)
        .render('error', {error: err})
});

module.exports = router;
