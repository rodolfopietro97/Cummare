
var messages = require('./grpc_generated_protos/protos/Publish_pb');
var services = require('./grpc_generated_protos/protos/Publish_grpc_pb');

var grpc = require('@grpc/grpc-js');

/**
 * Implements publishMessage RPC method.
 */
function publishMessage(call, publishMessageCallback) {
  var reply = new messages.PublishResponse();
  
  console.log(`Topic: ${call.request.getTopic()}`)
  console.log(`Message: ${call.request.getMessage()}`)

  reply.setAck(true);

  publishMessageCallback(null, reply);
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
    var server = new grpc.Server();
    server.addService(services.PublishTopicService, { publishMessage: publishMessage });
    server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), () => {
        console.log("Server is started")
        server.start();
    });
}

main();