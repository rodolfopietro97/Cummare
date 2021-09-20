import { RedisHandler } from "../redis_handler/RedisHandler";

// Publish service
var publishMessages = require('../grpc_generated_protos/protos/Publish_pb');
var publishServices = require('../grpc_generated_protos/protos/Publish_grpc_pb');

// GRPC
var grpc = require('@grpc/grpc-js');

/**
 * Server class.
 * 
 * It handle easily GRPC services and messages
 * to use in our P2P communication
 */
export class CummareServer {

    /**
     * Internal GRPC servers to use
     */
    grpcServers: Array<any> = []

    /**
     * Binds address-port.
     * 
     * A pair ip:port where server listening
     */
    binds: Array<string> = []

    /** 
     * Redis client handler 
     */
    private static redisHandler: RedisHandler = null

    /**
     * Allowed topics for redis server.
     * 
     * ALl clients can send messages with various topics,
     * but we must filter it to prevent attacks or errors 
     */
     private static allowedTopics: Array<string> = []

    /**
     * Constructor with parameters
     * 
     * @param binds Pair ip:port where server must listening
     * @param redisHandler Redis handler to use
     */
    constructor(binds: Array<string>, redisHandler: RedisHandler, allowedTopics: Array<string>) {
        // Init binding
        this.binds = binds

        // Init redis handler
        CummareServer.redisHandler = redisHandler

        // Init allowed topics
        CummareServer.allowedTopics = allowedTopics

        // Init grpc servers for each bind
        for (let index = 0; index < this.binds.length; index++) {
            this.grpcServers.push(new grpc.Server());
        }

        /*
         * Add services
         */
        // Publish service for each grpcServer
        this.grpcServers.forEach((grpcServer) => {
            grpcServer.addService(
                publishServices.PublishTopicService,
                {
                    publishMessage: this.publishMessage
                }
            );
        });
    }

    /**
     * Start function.
     * Server start listening on bind
     */
    start() {
        // For each binds start listening
        for (let index = 0; index < this.binds.length; index++) {
            this.grpcServers[index].bindAsync(
                this.binds[index],
                grpc.ServerCredentials.createInsecure(),
                () => {
                    console.log(`Cummare server listening on ${this.binds[index]}`)
                    this.grpcServers[index].start();
                }
            );
        }
    }

    /**
     * Publish a message
     * 
     * @param call 
     * @param publishMessageCallback 
     */
    publishMessage(callRequest, publishMessageCallback) {
        // Init resposnse
        var reply = new publishMessages.PublishResponse();

        // Get topic and message
        var currentRequestTopic = callRequest.request.getTopic()
        var currentRequestMessage = callRequest.request.getMessage()

        // Control if topic and message are valid and if valid publish messageo on topic queue
        var ack = CummareServer.controlTopicAndMessageAndEventuallyPublishMessage(currentRequestTopic, currentRequestMessage);

        // Response
        reply.setAck(ack)
        publishMessageCallback(null, reply);
    }

    /**
     * Control if topic and message are valid and if valid publish messageo on topic queue
     * 
     * NOTE: This method is static to avoid problem with
     * GRPC call on this.publishMessage()
     * 
     * @param topic Topic to control 
     * @param message Message to control
     */
    static controlTopicAndMessageAndEventuallyPublishMessage(topic, message): boolean {
        // Check validity
        let validFormat = typeof (JSON.parse(message)) === 'object' &&  // Messages must be objects
                          message != null &&                            // Messages must not be null
                          this.allowedTopics.includes(topic)            // Topic is allowed

        // Append on queue if valid
        if(validFormat)
            this.redisHandler.setTopic(topic, message)

        // Return validity
        return validFormat
    }
}