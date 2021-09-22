import { CummareServer } from './peers/CummareServer'

import { readFileSync } from 'fs';

import { RedisHandler } from './redis_handler/RedisHandler'

/**
 * Realtime viewer of topics and messages
 */
function mainViewer() {
  // Get Cummare server configuration form json file
  const cummareServerConfig = JSON.parse(
    readFileSync('./CummareServerConfig.json', 'utf-8')
  );

  // Init Redis client
  const redisHandler = new RedisHandler(cummareServerConfig.redis)

  // Set allowed topics
  let allowedTopics: Array<string> = cummareServerConfig.allowedTopics

  /*
   * List topics
   */
  setInterval(() => {
    // Clear console
    console.clear()

    // For each allowed topic
    allowedTopics.forEach(async (allowedTopic) => {

      // Get messages for topic and write it on the console
      let messagesForTopic = await redisHandler.getTopic(allowedTopic)
      console.log(`Messages for topic '${allowedTopic}':\n\t${messagesForTopic.join('\n\t')}`)
    });

  }, 1000)

}

mainViewer();