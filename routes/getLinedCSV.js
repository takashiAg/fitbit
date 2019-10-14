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

    const data = await getData(token, "https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1sec.json")
    const dataset = data["activities-heart-intraday"].dataset


    let CsvData = "time,heartRate\n"

    dataset.forEach(data => {
        CsvData += `${data.time},${data.value}\n`
    })
    res.send(CsvData)

});

function parseTime(time) {
    let data = time.split(";")
    return {hour: data[0], min: data[1], sec: data[2]}
}

function lined(dataset) {
    let processedData = []

    let before = {time: null, value: null}

    dataset.forEach(data => {
        if (before.time === null && before.time === value)
            before = data
        let d1 = {time: parseTime(before.time), value: before.value};
        let d2 = {time: parseTime(before.time), value: before.value};
        while (d1.time.hour === d2.time.hour && d1.time.min === d2.time.min && d1.time.sec === d2.time.sec) {
            console.log(d1,d2)
            d2.time.sec += 1
            if (d2.time.sec >= 60) {
                d2.time.sec -= 60
                d2.time.min += 1
            }
            if (d2.time.min >= 60) {
                d2.time.min -= 60
                d2.time.hour += 1
            }
        }
    })
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
