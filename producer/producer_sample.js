var AWS = require('aws-sdk'); 

//var kinesis = new AWS.Kinesis({region : 'us-west-2'});
var kinesis = new AWS.Kinesis({endpoint:'http://localhost:4567',region: 'FAKE'});

function createStream(streamName, numberOfShards, callback) {
  var params = {
    ShardCount: numberOfShards,
    StreamName: streamName
  };

  // Create the new stream if it does not already exist.
  kinesis.createStream(params, function(err, data) {
    if (err && err.code !== 'ResourceInUseException') {
      callback(err);
      return;
    }
    // Make sure the stream is in the ACTIVE state before
    // you start pushing data.
    waitForStreamToBecomeActive(streamName, callback);
  });
}


function waitForStreamToBecomeActive(streamName, callback) {
  kinesis.describeStream({StreamName : streamName},function(err, data) {
    if (err) {
      callback(err);
      return;
    }

    if (data.StreamDescription.StreamStatus === 'ACTIVE') {
      callback();
    }
    // The stream is not ACTIVE yet. Wait for another 5 seconds before
    // checking the state again.
    else {
      setTimeout(function() {
        waitForStreamToBecomeActive(streamName, callback);
      }, 5000);
    }
  });
}

function writeToKinesis(streamName) {
  var randomNumber = Math.floor(Math.random() * 100000);
  var data = 'hogehoge-data-' + randomNumber;
  var partitionKey = 'pk-' + randomNumber;
  var recordParams = {
    Data: data,
    PartitionKey: partitionKey,
    StreamName: streamName
  };

  kinesis.putRecord(recordParams, function(err, data) {
    if (err) {
      console.error(err);
    }
  });
}

createStream('stream-name', 2, function(err) {
  if (err) {
    console.error('Error starting Kinesis producer: ' + err);
    return;
  }
  for (var i = 0 ; i < 5 ; ++i) {
    writeToKinesis('stream-name');
  }
});
