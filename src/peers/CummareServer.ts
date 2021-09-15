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
    binds: Array<string>


    /**
     * Constructor with parameters
     * 
     * @param binds Pair ip:port where server must listening
     */
    constructor(binds: Array<string>) {
        // Init binding
        this.binds = binds
        
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
        })
    }


    /**
     * Start function.
     * Server start listening on bind
     */
    start() {
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

        console.log(`Topic: ${callRequest.request.getTopic()}`)
        console.log(`Message: ${callRequest.request.getMessage()}`)

        reply.setAck(true);

        publishMessageCallback(null, reply);
    }
}