// Redis
var Redis = require('ioredis')

/**
 * Handle as a BlackBox all Redis operations.
 * 
 * It adapt PubSub operationsm to Redis
 */
export class RedisHandler {

    /**
     * Internal redis client variable
     */
    redisClient: any
    
    /**
     * Constructor with parameters
     * 
     * @param clientInfomrations Informations about Redis client
     */
    constructor(clientInfomrations) {
        this.redisClient = new Redis(clientInfomrations)
    }

    /**
     * Delete all messages for a topic
     * 
     * @param topic Topic to delete
     */
    deleteTopic(topic: string): void {
        this.redisClient.del(topic)
    }

    /**
     * Push a message for a specific topic
     * 
     * @param topic Topic of message
     * @param message Messgae of topic
     */
    setTopic(topic: string, message: string): void {
        // Add timespamp and age
        let messageObject = JSON.parse(message);
        messageObject.timestamp = Date.now();

        // Push message with timestamp
        this.redisClient.rpush(topic, JSON.stringify(messageObject))
    }

    /**
     * Get all messages for a topic
     * 
     * @param topic Topic to read
     * @returns Messages of topic
     */
    async getTopic(topic: string): Promise<Array<string>> {
        let listOfMessages = await this.redisClient.lrange(topic, 0, -1);
        
        return listOfMessages
    }
}