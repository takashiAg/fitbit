var express = require('express');
var router = express.Router();
const request = require('request-promise');

const clientId = '22B538'
const clientSecret = 'c8a76dd920bf40ff80f9e64f20b3860d'

/* GET home page. */
router.get('/', async function (req, res, next) {
    if (!("code" in req.query))
        next(new Error('no code'))
    const code = req.query.code
    const data = await getToken(clientId, clientSecret, code)
    console.log(data)
    res.render('getCode', {code: code});
}, function (err, req, res, next) {
    res
        .status(400)
        .render('error', {error: err})
});

function getToken(clientId, clientSecret, code) {

    const b64 = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const options = {
        url: 'https://api.fitbit.com/oauth2/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${b64}`
        },
        form: {
            clientId,
            "grant_type": "authorization_code",
            "redirect_uri": "http://127.0.0.1:8080/getCode",
            code
        }
    }
    return request(options)
}

module.exports = router;
