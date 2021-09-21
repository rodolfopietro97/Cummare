// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var protos_Subscribe_pb = require('../protos/Subscribe_pb.js');

function serialize_subscribe_SubscribeRequest(arg) {
  if (!(arg instanceof protos_Subscribe_pb.SubscribeRequest)) {
    throw new Error('Expected argument of type subscribe.SubscribeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_subscribe_SubscribeRequest(buffer_arg) {
  return protos_Subscribe_pb.SubscribeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_subscribe_SubscribeResponse(arg) {
  if (!(arg instanceof protos_Subscribe_pb.SubscribeResponse)) {
    throw new Error('Expected argument of type subscribe.SubscribeResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_subscribe_SubscribeResponse(buffer_arg) {
  return protos_Subscribe_pb.SubscribeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// *
// Publish topic proto.
//
// In the PUB-SUB part, it is the PUB
var SubscribeTopicService = exports.SubscribeTopicService = {
  // *
// Publish a message
subscribeTopic: {
    path: '/subscribe.SubscribeTopic/subscribeTopic',
    requestStream: false,
    responseStream: true,
    requestType: protos_Subscribe_pb.SubscribeRequest,
    responseType: protos_Subscribe_pb.SubscribeResponse,
    requestSerialize: serialize_subscribe_SubscribeRequest,
    requestDeserialize: deserialize_subscribe_SubscribeRequest,
    responseSerialize: serialize_subscribe_SubscribeResponse,
    responseDeserialize: deserialize_subscribe_SubscribeResponse,
  },
};

exports.SubscribeTopicClient = grpc.makeGenericClientConstructor(SubscribeTopicService);
