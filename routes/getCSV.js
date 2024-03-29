var express = require('express');
var router = express.Router();
const request = require('request-promise');
const datastore = require('nedb-promise')


router.get('/', async function (req, res, next) {
    let DB = datastore({
        filename: 'data/token.json',
        autoload: true // so that we don't have to call loadDatabase()
    })
    let tokendatabase = await DB.findOne({})

    const token = tokendatabase.access_token;

    const data = await getData(token, "https://api.fitbit.com/1/user/-/activities/heart/date/2019-10-22/1d.json")
    const dataset = data["activities-heart-intraday"].dataset

    let CsvData = "time,heartRate\n"

    dataset.forEach(data => {
        CsvData += `${data.time},${data.value}\n`
    })

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=rawData.csv');

    res.send(CsvData)

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
