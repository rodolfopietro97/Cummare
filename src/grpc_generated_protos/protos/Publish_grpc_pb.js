// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var protos_Publish_pb = require('../protos/Publish_pb.js');

function serialize_publish_PublishRequest(arg) {
  if (!(arg instanceof protos_Publish_pb.PublishRequest)) {
    throw new Error('Expected argument of type publish.PublishRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_publish_PublishRequest(buffer_arg) {
  return protos_Publish_pb.PublishRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_publish_PublishResponse(arg) {
  if (!(arg instanceof protos_Publish_pb.PublishResponse)) {
    throw new Error('Expected argument of type publish.PublishResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_publish_PublishResponse(buffer_arg) {
  return protos_Publish_pb.PublishResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// *
// Publish topic proto.
//
// In the PUB-SUB part, it is the PUB
var PublishTopicService = exports.PublishTopicService = {
  // *
// Publish a message
publishMessage: {
    path: '/publish.PublishTopic/publishMessage',
    requestStream: false,
    responseStream: false,
    requestType: protos_Publish_pb.PublishRequest,
    responseType: protos_Publish_pb.PublishResponse,
    requestSerialize: serialize_publish_PublishRequest,
    requestDeserialize: deserialize_publish_PublishRequest,
    responseSerialize: serialize_publish_PublishResponse,
    responseDeserialize: deserialize_publish_PublishResponse,
  },
};

exports.PublishTopicClient = grpc.makeGenericClientConstructor(PublishTopicService);
