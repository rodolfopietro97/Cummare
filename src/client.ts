var messages = require('./grpc_generated_protos/protos/Publish_pb');
var services = require('./grpc_generated_protos/protos/Publish_grpc_pb');

var grpc = require('@grpc/grpc-js');

function mainClient() {

  var client = new services.PublishTopicClient('localhost:50052', grpc.credentials.createInsecure());
  var request = new messages.PublishRequest();
  request.setMessage("weee");
  request.setTopic("ouu");
  
  client.publishMessage(request, function(err, response) {
    console.log('Greeting:', response.getAck());
  });
}

mainClient();