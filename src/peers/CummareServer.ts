import { RedisHandler } from "../redis_handler/RedisHandler";

// Publish service
var publishMessages = require('../grpc_generated_protos/protos/Publish_pb');
var publishServices = require('../grpc_generated_protos/protos/Publish_grpc_pb');

// Subscribe service
var subscribeMessages = require('../grpc_generated_protos/protos/Subscribe_pb');
var subscribeServices = require('../grpc_generated_protos/protos/Subscribe_grpc_pb');

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
     * Internal GRPC server to use
     */
    grpcServer: any

    /**
     * Bind address-port.
     * 
     * A pair ip:port where server listening
     */
    bind: string

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
     * @param bind Pair ip:port where server must listening
     * @param redisHandler Redis handler to use
     */
    constructor(bind: string, redisHandler: RedisHandler, allowedTopics: Array<string>) {
        // Init binding
        this.bind = bind

        // Init redis handler
        CummareServer.redisHandler = redisHandler

        // Init allowed topics
        CummareServer.allowedTopics = allowedTopics

        // Init grpc server
        this.grpcServer = new grpc.Server();

        /*
         * Add services
         */
        // Add publish service
        this.grpcServer.addService(
            publishServices.PublishTopicService,
            {
                publishMessage: this.publishMessage
            }
        );

        // Add subscribe service
        this.grpcServer.addService(
            subscribeServices.SubscribeTopicService,
            {
                subscribeTopic: this.subscribeTopic
            }
        );

    }

    /**
     * Start function.
     * Server start listening on bind
     */
    start(): void {
        // Start listening for binded server
        this.grpcServer.bindAsync(
            this.bind,
            grpc.ServerCredentials.createInsecure(),
            () => {
                console.log(`Cummare server listening on ${this.bind}`)
                this.grpcServer.start();
            }
        );
    }

    /**
     * Publish a message
     * 
     * @param callRequest 
     * @param publishMessageCallback 
     */
    async publishMessage(callRequest: any, publishMessageCallback: any): Promise<void> {
        // Init resposnse
        var reply = new publishMessages.PublishResponse();

        // Get topic and message
        var currentRequestTopic = callRequest.request.getTopic()
        var currentRequestMessage = callRequest.request.getMessage()

        // Control if topic and message are valid and if valid publish messageo on topic queue
        var ack = await CummareServer.controlTopicAndMessageAndEventuallyPublishMessage(currentRequestTopic, currentRequestMessage);

        // Response
        reply.setAck(ack)
        publishMessageCallback(null, reply);
    }

    /**
     * Subscribe stream of messages
     * 
     * @param callRequest 
     * @param publishMessageCallback 
     */
     async subscribeTopic(callRequest: any): Promise<void> {
        // Init resposnse
        var reply = new subscribeMessages.SubscribeResponse();

        // Get topic that client want to subscribe
        var currentSubscribedTopic = callRequest.request.getTopic()

        // Fetch all messages available
        let messages = await CummareServer.redisHandler.getTopic(currentSubscribedTopic)
        
        // Stream each message
        for (let index = 0; index < messages.length; index++) {
            reply.setMessage(messages[index]);
            callRequest.write(reply)
        }

        // End GRPC call
        callRequest.end();
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
    static async controlTopicAndMessageAndEventuallyPublishMessage(topic, message): Promise<boolean> {
        // Check validity
        let validFormat: boolean = typeof (JSON.parse(message)) === 'object' &&     // Messages must be objects
                          message != null &&                                        // Messages must not be null
                          this.allowedTopics.includes(topic)                        // Topic is allowed

        // Check if element exists
        let exists: boolean = (await this.redisHandler.getTopic(topic))
            // Remove timestamps
            .map((message) => {
                // Get object and removes timestamp
                let messageObject = JSON.parse(message)
                delete messageObject.timestamp

                // Return stringified version
                return JSON.stringify(messageObject)
            })

            // Check inclusion
            .includes(message)

        // Append on queue if valid
        if(validFormat && !exists)
            this.redisHandler.setTopic(topic, message)

        // Return validity
        return validFormat && !exists
    }

    /**
     * Fetch messages for a specific topic
     * 
     * NOTE: This method is static to avoid problem with
     * GRPC call on this.subscribeTopic()
     * 
     * @param topic Topic for which subscribe messages
     */
    static fetchMessagesForSpecifiedTopic(topic) {
        var messagesForTopic = []
        this.redisHandler.getTopic(topic).then((messages) => {
            messagesForTopic = messages
        });

        return messagesForTopic
    }
}