let request = require('request'),
    td = require('../test_data.json');

let options = {
    baseUrl: 'https://www.metaweather.com/api',
    uri: '',
    json: true
};

describe("Checking the Weather API", function () {
    it("should search for " + td.city[0].name, function (done) {
        options.uri = '/location/search/?query=' + td.city[0].name;

        request(options, function (err, res) {
            if (err) console.log(err);
            else {
                expect(res.body[0].title).toBe(td.city[0].name);
                expect(res.statusCode).toBe(200);
                expect(res.statusMessage).toBe('OK');
                done();
            }
        });
    });

    it("should search for " + td.city[1].name, function (done) {
        options.uri = '/location/search/?query=' + td.city[1].name;

        request(options, function (err, res) {
            if (err) console.log(err);
            else {
                expect(res.body[0].title).toBe(td.city[1].name);
                expect(res.statusCode).toBe(200);
                expect(res.statusMessage).toBe('OK');
                done();
            }
        });
    });

    it("coordinates should return city " + td.city[0].name, function (done) {
        options.uri = '/location/search/?query=' + td.city[0].name;

        request(options, function (err, res) {
            if (err) console.log(err);
            else {
                td.coordinates = res.body[0].latt_long;
                options.uri = '/location/search/?lattlong=' + td.coordinates;
                request(options, function (errr, result) {
                    if (errr) console.log(errr);
                    else {
                        expect(result.body[0].title).toBe(td.city[0].name);
                        expect(result.body[0].distance).toBe(0);
                        expect(result.body[0].latt_long).toBe(td.coordinates);
                        expect(result.statusCode).toBe(200);
                        expect(result.statusMessage).toBe('OK');
                        done();
                    }
                })
            }
        });
    });

    it("should return current date weather for " + td.city[0].name, function (done) {
        options.uri = '/location/search/?query=' + td.city[0].name;

        request(options, function (err, res) {
            if (err) console.log(err);
            else {
                td.woeid = res.body[0].woeid;

                options.uri = '/location/' + td.woeid;

                request(options, function (errr, result) {
                    if (errr) console.log(errr);
                    else {
                        expect(result.body.title).toBe(td.city[0].name);
                        expect(result.statusCode).toBe(200);
                        expect(result.statusMessage).toBe('OK');
                        done();

                        let dt = new Date(result.body.consolidated_weather[0].applicable_date);

                        let date = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();

                        console.log("The weather state for " + date + " is", result.body.consolidated_weather[0].weather_state_name);
                        console.log("Current wind speed is ", result.body.consolidated_weather[0].wind_speed.toFixed(2));
                        console.log("Current temperature is ", result.body.consolidated_weather[0].the_temp.toFixed(1));

                    }
                })
            }
        });
    });

    it("should return weather for 17-05-2017 at 14:26 for " + td.city[1].name, function (done) {
        options.uri = '/location/search/?query=' + td.city[1].name;

        request(options, function (err, res) {
            if (err) console.log(err);
            else {
                td.woeid = res.body[0].woeid;

                options.uri = '/location/' + td.woeid + "/2017/5/17";

                request(options, function (errr, result) {
                    if (errr) console.log(errr);
                    else {
                        expect(result.statusCode).toBe(200);
                        expect(result.statusMessage).toBe('OK');
                        done();

                        let index = result.body.findIndex(function (item) {
                            let i;
                            for (let i = 0; i < result.body.length; i++) {
                                if (item.created.indexOf("2017-05-17T14:") !== -1) {
                                    return i = item.created;
                                }
                            }
                        });

                        let dt = new Date(result.body[index].created);

                        let date = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
                        let time = dt.getHours() + ":" + dt.getMinutes();

                        console.log("The weather state for " + date + " " + time + " is", result.body[index].weather_state_name);
                        console.log("The wind speed is", result.body[index].wind_speed.toFixed(2));
                        console.log("The temperature is", result.body[index].the_temp.toFixed(1));

                    }
                })
            }
        });
    });
});