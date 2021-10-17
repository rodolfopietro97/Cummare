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
     * Delete specific message for topic
     * 
     * @param topic Topic to delete
     * @param message Message to delete
     */
    deleteMessageForTopic(topic: string, message: string): void {
        this.redisClient.lrem(topic, 0, message)
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
     * 
     * @returns Messages of topic
     */
    async getTopic(topic: string): Promise<Array<string>> {
        let listOfMessages = await this.redisClient.lrange(topic, 0, -1);
        
        return listOfMessages
    }

    /**
     * Get first n messages for a topic.
     * This function is useful for viewer
     * 
     * @param topic Topic to read
     * @param numberOfMessagesToGet Maximum number of messages to get
     * 
     * @returns Messages of topic
     */
     async getFirstNMessagesForATopic(topic: string, numberOfMessagesToGet: Number): Promise<Array<string>> {
        let listOfMessages = await this.redisClient.lrange(topic, 0, numberOfMessagesToGet);
        
        return listOfMessages
    }

    /**
     * Get size (number of messages) of a topic
     * 
     * @param topic Topic to read
     * 
     * @returns Size of topic
     */
     async getTopicSize(topic: string): Promise<Number> {
        return this.redisClient.llen(topic);
    }
}