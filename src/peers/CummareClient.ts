// Publish service
var publishMessages = require('../grpc_generated_protos/protos/Publish_pb');
var publishServices = require('../grpc_generated_protos/protos/Publish_grpc_pb');

// Subscribe service
var subscribeMessages = require('../grpc_generated_protos/protos/Subscribe_pb');
var subscribeServices = require('../grpc_generated_protos/protos/Subscribe_grpc_pb');

// GRPC
var grpc = require('@grpc/grpc-js');

/**
 * Client class.
 * 
 * It handle easily GRPC services and messages
 * to use in our P2P communication
 */
export class CummareClient {

    /**
     * Internal GRPC client to use for publish request
     */
    grpcPublishClient: any

    /**
     * Internal GRPC client to use for publish request
     */
    grpcSubscribeClient: any
    
    /**
     * Binds address-port of server.
     * 
     * A pair ip:port wfind servers
     */
     serverBind: string

    /**
     *  Current ack of response
     * 
     * A pair ip:port wfind servers
     */
     currentAck: boolean = false

    /**
     * Constructor with parameters
     * 
     * @param serverBind Pair ip:port where server is contacted
     */
    constructor(serverBind: string) {
        // Init servers bindings
        this.serverBind = serverBind
        
        /*
         * Init grpc client services for bind server
         */
        // Publish service
        this.grpcPublishClient = new publishServices.PublishTopicClient(
            this.serverBind, 
            grpc.credentials.createInsecure()
        )

        // Subscribe service
        this.grpcSubscribeClient = new subscribeServices.SubscribeTopicClient(
            this.serverBind,
            grpc.credentials.createInsecure()
        )

    }

    /**
     * Publish message function
     * 
     * @param topic Topic of message 
     * @param message Message to send
     * @param onPublishMessage Callback that sat "What do with on publish message response"
     */
    publishMessage(topic: string, message: string, onPublishMessage: any): void {
        // Init request
        var request = new publishMessages.PublishRequest();

        request.setMessage(message);
        request.setTopic(topic);

        // Publish for specific client
        this.grpcPublishClient.publishMessage(
            request, 
            (error, response) => {
                onPublishMessage(response.getAck())
            }
        );
    }

    /**
     * Subscribe to a topic function
     * 
     * @param topic Topic to subscribe
     */
    subscribeTopic(topic: string) {
        // Init request and set topic of request
        var request = new subscribeMessages.SubscribeRequest();
        request.setTopic(topic);

        // Return stream
        return this.grpcSubscribeClient.subscribeTopic(request);
    }
}