var express = require('express');
var nmea = require('nmea-0183');
var usergrid = require('usergrid');
var app = express();

app.use(express.logger());
app.use(express.bodyParser());

app.configure('development', function(){
    app.use(express.errorHandler());
});

var client = new usergrid.client({
    URI: 'http://usergridstack.dnsdynamic.com:8080',
    orgName: 'deneme',
    appName: 'sandbox',
    logging: true
});

app.get('/', function(request, response) {
    response.send('Tasma Usergrid Proxy Server');
});

app.post('/locations', function(request, response) {
    var gpsData = nmea.parse(request.body.gps_data);

    var loc = new usergrid.entity({
        client: client,
        data: {
            type: 'locations',
            session_id: request.body.session_id,
            latitude: gpsData.latitude,
            longitude: gpsData.longitude
        }
    });

    loc.save(function (err) {
        response.send(err ? 500 : 201);
    });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log('Listening on ' + port);
});