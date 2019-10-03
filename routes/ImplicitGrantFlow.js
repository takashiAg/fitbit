var express = require('express');
var router = express.Router();
const request = require('request-promise');
const url = require('url')

const clientId = '22B595'
const clientSecret = 'c46444c0fe1cc9d5b8a5c020d7abefea'

/* GET home page. */
router.get('/', async function (req, res, next) {
    console.log(req.query)
    if (!("access_token" in req.query))
        next(new Error('no access_token'))
    if (!("user_id" in req.query))
        next(new Error('no user_id'))
    if (!("token_type" in req.query))
        next(new Error('no token_type'))

    const token = req.query['access_token']
    console.log(token)
    const data = await getData(token, "https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1sec.json")
    // const data = await getData(token, "https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1s/time/01:00/01:10.json")
    // const data = await getData(token, "https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1s/time/00:00/05:00.json")
    // const data = await getData(token, "https://api.fitbit.com/1/user/7S7TPW/activities/heart/date/2019-10-01/2019-10-02/1sec.json")


    var util = require('util');
    console.log(util.inspect(data, false, null));
    console.log(Object.keys(data))
    // console.log(data2)
    res.render('getCode', {code: "code"});
}, function (err, req, res, next) {
    res
        .status(400)
        .render('error', {error: err})
});

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
// http://127.0.0.1:8080/ImplicitGrantFlow#
// access_token=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMkI1OTUiLCJzdWIiOiI3UzdUUFciLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJhY3QgcnNldCBybG9jIHJ3ZWkgcmhyIHJwcm8gcm51dCByc2xlIiwiZXhwIjoxNTcwNjUzODc3LCJpYXQiOjE1NzAwNzA1ODB9.o-YThIxFT--9XxLMR8kQR24wbcQwWpzumsj_xiKP-4E
// &user_id=7S7TPW
// &scope=profile+heartrate+location+nutrition+activity+settings+social+weight+sleep
// &token_type=Bearer
// &expires_in=583297
