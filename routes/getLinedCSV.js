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

    const linedDataset = lined(dataset)

    let CsvData = "time,heartRate\n"

    linedDataset.forEach(data => {
        CsvData += `${data.time},${data.value}\n`
    })
    res.send(CsvData)

});

function getSecond(time) {
    let data = time.split(":")
    return (data[0] - 0) * 24 * 60 + (data[1] - 0) * 60 + (data[2] - 0)
}


function getTime(Second) {
    let second = Second % 60
    let min = ((Second - second) / 60) % 24
    let hour = (Second - min * 60 - second) / 24 / 60
    second = ('0' + second).slice(-2)
    min = ('0' + min).slice(-2)
    hour = ('0' + hour).slice(-2)
    return `${hour}:${min}:${second}`
}

function lined(dataset) {
    let processedData = []

    let before = {time: null, value: null}

    dataset.forEach(data => {
        // console.log(before, data)
        if (before.time === null && before.value === null) {
            before = data
            return
        }

        let d1 = {time: getSecond(before.time), value: before.value};
        let d2 = {time: getSecond(data.time), value: data.value};
        console.log(d1, d2)
        while (d1.time < d2.time) {
            processedData.push({time: getTime(d1.time), value: (d2.value - d1.value) / (d2.time - d1.time) * (d2.time - d1.time) + d1.value})
            d1.time += 1
        }
        before = data
    })
    console.log(processedData)
    return processedData
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
