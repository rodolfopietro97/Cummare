// Publish service
var publishMessages = require('../grpc_generated_protos/protos/Publish_pb');
var publishServices = require('../grpc_generated_protos/protos/Publish_grpc_pb');

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
     * Internal GRPC client to use
     */
    grpcClient: any

    
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
        this.grpcClient = new publishServices.PublishTopicClient(
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
        this.grpcClient.publishMessage(
            request, 
            (error, response) => {
                onPublishMessage(response.getAck())
            }
        );
    }

}