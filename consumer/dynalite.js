var AWS = require('aws-sdk');
var dynamo = new AWS.DynamoDB({endpoint: 'http://localhost:4568'});
dynamo.listTables(console.log.bind(console));

