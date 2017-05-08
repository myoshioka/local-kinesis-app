var kcl = require('aws-kcl');

function recordProcessor() {
  //var log = logger().getLogger("recordConsumer");
  var shardId;

  return {

    initialize(initializeInput, completeCallback) {
      console.log('--------- initialize -------------');
      shardId = initializeInput.shardId;

      completeCallback();
    },

    processRecords(processRecordsInput, completeCallback) {
      console.log('--------- processRecords -------------');
      
      if (!processRecordsInput || !processRecordsInput.records) {
        completeCallback();
        return;
      }

      var records = processRecordsInput.records;
      var record, sequenceNumber, partitionKey, data;
      
      for (var i = 0 ; i < records.length ; ++i) {
        record = records[i];
        sequenceNumber = record.sequenceNumber;
        partitionKey = record.partitionKey;
        // Data is in base64 format.
        data = new Buffer(record.data, 'base64').toString();
        // Record processing logic here.
        console.log('--------- data -------------');
        console.log(data);
      }
      // Checkpoint last sequence number.
      processRecordsInput.checkpointer.checkpoint(
        sequenceNumber, function(err, sn) {
          // Error handling logic. In this case, we call
          // completeCallback to process more data.
          completeCallback();
        }
      );
    },

    shutdown(shutdownInput, completeCallback) {
      // Checkpoint should only be performed when shutdown reason is TERMINATE.
      if (shutdownInput.reason !== 'TERMINATE') {
        completeCallback();
        return;
      }
      // Whenever checkpointing, completeCallback should only be invoked once checkpoint is complete.
      shutdownInput.checkpointer.checkpoint(function(err) {
        completeCallback();
      });
    }
  };
}

kcl(recordProcessor()).run();



