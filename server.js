const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const moment = require('moment');
const path = require('path');
const iotHubClient = require('./IoTHub/iot-hub.js');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res/*, next*/) {
  res.redirect('/');
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      try {
        console.log('sending data ' + data);
        client.send(data);
      } catch (e) {
        console.error(e);
      }
    }
  });
};

counter = 0
function sendTest(){
  console.log('counter:' + counter)
  
  var testdata1 = { "device_id":"EmerZen_Device1","accelerometer_x":"-0.20",
      "accelerometer_y":"-0.11","accelerometer_z":"0.95",
      "temperature":"26.12",
      "light":"46",
      "time":"2018:05:23T09:58:46"
  }
  var testdata2 = {
   "device_id": "EmerZen_Device2",
   "timeStamp": "2018-05-24T22:33:22.000+10:00",
   "bayState": "1",
   "MAC1": "D43639D8A108",
   "MAC2": "C80F10329466",
   "MAC3": "C80F10325F00"
  }


  var testdata3 = {
   "device_id": "EmerZen_Device2",
   "timeStamp": "2018-05-24T22:33:22.000+10:00",
   "bayState": "0",
  }

  var testdata4 = {
   "device_id": "EmerZen_Device2",
   "timeStamp": "2018-05-24T22:33:22.000+10:00",
   "bayState": "1",
   "MAC1": "D43639D8A108",
   "MAC2": "C80F10329466",
   "MAC3": "C80F10325F00"
  }

  if ( counter % 2  == 0 ){
    console.log('Sending to client' + JSON.stringify(testdata1))
    wss.broadcast(JSON.stringify(testdata3));
  }
  else{
    console.log('Sending to client' + JSON.stringify(testdata2))
    wss.broadcast(JSON.stringify(testdata2));
  }

  wss.broadcast(JSON.stringify(testdata4));
  wss.broadcast(JSON.stringify(testdata3));

  counter = counter + 1
}


/*
console.log("ENV"+ process.env['Azure.IoT.IoTHub.ConnectionString'])
var iotHubReader = new iotHubClient(process.env['Azure.IoT.IoTHub.ConnectionString'], process.env['Azure.IoT.IoTHub.ConsumerGroup']);
iotHubReader.startReadMessage(function (obj, date) {
  try {
    console.log(date);
    date = date || Date.now()
    console.log(JSON.stringify(Object.assign(obj, { time: moment.utc(date).format('YYYY:MM:DD[T]hh:mm:ss') })));
    wss.broadcast(JSON.stringify(Object.assign(obj, { time: moment.utc(date).format('YYYY:MM:DD[T]hh:mm:ss') })));
  } catch (err) {
    console.log(obj);
    console.error(err);
  }
});*/

setInterval(sendTest, 5000);

var port = normalizePort(process.env.PORT || '3000');
server.listen(port, function listening() {
  console.log('Listening on %d', server.address().port);
  
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
