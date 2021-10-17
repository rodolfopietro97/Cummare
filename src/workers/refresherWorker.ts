import { RedisHandler } from "../redis_handler/RedisHandler";

/**
 * This file handle the work of refresher program
 * 
 * Every 'maxTopicsAgeMilliseconds' old messages are removed for a specific topic
 * 
 * @param cummareServerConfig Server configuration parameters of Cummare server 
 * @param redisHandler  Handler class for redis Server
 * @param currentTopicToUpdate Current topic to update
 */
export async function refresherWorker(cummareServerConfig: any, redisHandler: RedisHandler, currentTopicToUpdate: string) : Promise<void> {
    // Get current time time
    var now = Date.now()

    // Get messages for topic
    let messagesForTopic = await redisHandler.getTopic(currentTopicToUpdate);

    // Check for each message if it must be removed
    for (let index = 0; index < messagesForTopic.length; index++) {
        // Set object message
        const objectMessage = JSON.parse(messagesForTopic[index]);

        // If message is due, we can remove it
        if (isMessageDue(now, objectMessage.timestamp, cummareServerConfig.maxTopicsAgeMilliseconds)) {
            // Remove current message from current topic
            redisHandler.deleteMessageForTopic(currentTopicToUpdate, JSON.stringify(objectMessage));
        }

    }
}

/**
 * Verify if a message is due
 * 
 * @param now Current time
 * @param messageTimestamp Timestamp on message (when it is sended)
 * @param maxTopicsAgeMilliseconds Max age that a topic can have
 * 
 * @returns If a message is due or not 
 */
export function isMessageDue(now: Number, messageTimestamp: Number, maxTopicsAgeMilliseconds: Number) : boolean {
    return (Number(now) - Number(messageTimestamp)) >= maxTopicsAgeMilliseconds
}
