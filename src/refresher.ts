import { CummareServer } from './peers/CummareServer'

import { readFileSync } from 'fs';

import { RedisHandler } from './redis_handler/RedisHandler'

/**
 * Realtime updater of topics and messages.
 * 
 * Every 'cummareServerConfig.maxTopicsAgeMilliseconds' seconds
 * topics are removed
 */
function mainUpdater() {
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

    // For each allowed topic
    allowedTopics.forEach(async (allowedTopic) => {

      // Now time
      var now = Date.now()

      // Get messages for topic
      let messagesForTopic = await redisHandler.getTopic(allowedTopic);

      // Check for each message if it must be removed
      for (let index = 0; index < messagesForTopic.length; index++) {
        // Set object message
        const objectMessage = JSON.parse(messagesForTopic[index]);

        // If message is due, we can remove it
        if ((Number(now) - Number(objectMessage.timestamp)) >= cummareServerConfig.maxTopicsAgeMilliseconds) {
          redisHandler.deleteMessageForTopic(allowedTopic, JSON.stringify(objectMessage));
        }
        
      }
  });

  }, 1000)

}

mainUpdater();