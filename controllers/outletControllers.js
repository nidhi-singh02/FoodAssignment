const log = require("../utils/logger")
const Validator = require('validatorjs')
const NodeGeocoder = require('node-geocoder');
const Supercluster = require('supercluster');
var GeoJSON = require('geojson');
var BBox = require('bbox');
var url = require('url');//GLOBAL MODULE
var request = require('request-promise');

exports.getOutletDetails = async function (req, res) {

    log.info("getOutletDetails started")

    var jsonRequest = {};
    var nearest = []

    log.info("req", req.body);

    let validation = new Validator({
        address: req.body.address
    }, {
        address: 'required'
    });
    if (validation.fails()) {
        res.send({ "status": 502, message: validation.errors })
    }
    else {

        try {
            jsonRequest.address = req.body.address


            const options = {
                provider: 'locationiq',
                apiKey: 'da840f9bb9068b',
                formatter: 'json'
            };

            const geocoder = NodeGeocoder(options);

            const result = await geocoder.geocode(jsonRequest.address);
            log.info("result", result[0]);

            var data = { name: req.body.address, street: result[0].streetName, lat: result[0].latitude, lng: result[0].longitude }

            const index = new Supercluster({
                radius: 40,
                maxZoom: 16
            });

            // Calling locationiq API to get restraunts within 10km from the specified lat and long
            request({
                method: 'GET',
                url: 'https://eu1.locationiq.com/v1/nearby.php?key=' + options.apiKey + '&lat=' + data.lat + '&lon=' + data.lng + '&tag=restaurant&radius=10000&format=json',
                resolveWithFullResponse: true
            })
                .then((r1) => {


                    var api_resp = JSON.parse(r1.body)
                    log.info("locationq response------------", api_resp);
                    var resultFromApi = Object.entries(api_resp);


                    resultFromApi.forEach(([key, value]) => {

                        if (value.distance < 1000) {
                            nearest.push(value)
                        }
                    });

                    log.info("nearest restro", nearest.length, nearest);

                    geocoder.de
                    res.send({ "status": 200, "payload": nearest })

                })
                .catch(err => {
                    console.log("location q err", err);
                })


            GeoJSON.parse(data, { Point: ['lat', 'lng'], include: ['name'] }, function (geojson) {
                console.log("geojson", JSON.stringify(geojson));
                log.info("load", index.load(geojson));
                var fixed = BBox.create(-(result[0].longitude), -(result[0].latitude), result[0].longitude, result[0].latitude);
                log.info("fixed", fixed)
                var Clusters = index.getClusters([fixed.x0, fixed.y0, fixed.x1, fixed.y1], 2);
                log.info("Clusters", Clusters)
            });

            //   const res = await geocoder.reverse({ lat: 45.767, lon: 4.833 });


        } catch (err) {
            log.error("error throw from controller of outlet search :", err)
            res.send({ "status": 500, " user message": "System error", "dev message": err })
        }

    }
}

