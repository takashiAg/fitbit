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
    const token = await getToken(clientId, clientSecret, code)
    console.log(token)
    const data2 = await getData(token, "https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1m.json")
    console.log(data2)
    res.render('getCode', {code: code});
}, function (err, req, res, next) {
    res
        .status(400)
        .render('error', {error: err})
});

async function getToken(clientId, clientSecret, code) {

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
    const data = JSON.parse(await request(options))
    if (!("access_token" in data)) throw new Error("no token")
    return data.access_token

}

async function getData(token, url) {
    const options = {
        url,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    return JSON.parse(await request(options))
}

module.exports = router;
