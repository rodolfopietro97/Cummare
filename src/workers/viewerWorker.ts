import { RedisHandler } from "../redis_handler/RedisHandler";

/**
 * This file handle the work of viewer program
 * 
 * Display all ifnromations abount messages and topics,
 * and for each topic display first 'maximumMessagesToDisplayInViewer' messages
 * 
 * @param cummareServerConfig Server configuration parameters of Cummare server 
 * @param redisHandler  Handler class for redis Server
 * @param currentTopicToDisplay Current topic to display
 */
export async function viewerWorker(cummareServerConfig: any, redisHandler: RedisHandler, currentTopicToDisplay: string): Promise<void> {
    // Get first 'maximumMessagesToDisplayInViewer' messages for topic and write it on the console
    let messagesForTopic = await redisHandler.getFirstNMessagesForATopic(currentTopicToDisplay, cummareServerConfig.maximumMessagesToDisplayInViewer)

    // Get number of all messages contained in the topic
    let numberOfAllMessagesForTopic = await redisHandler.getTopicSize(currentTopicToDisplay)

    // Output messages
    console.log(`\nFirst ${cummareServerConfig.maximumMessagesToDisplayInViewer} messages for topic '${currentTopicToDisplay}' (total messages: ${numberOfAllMessagesForTopic}):\n\t${messagesForTopic.join('\n\t')}`)
}