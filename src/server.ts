import { CummareServer } from './peers/CummareServer'

import { readFileSync } from 'fs';

import { RedisHandler } from './redis_handler/RedisHandler'

/**
 * Simple Cummare Server.
 * 
 * It does 2 main tasks:
 *    Receives topics and messages by peers
 *    Broadcast messages to all peers in listening
 */
function main() {
  // Get Cummare server configuration form json file
  const cummareServerConfig = JSON.parse(
    readFileSync('./CummareServerConfig.json', 'utf-8')
  );

  // Init Redis client
  const redisHandler = new RedisHandler(cummareServerConfig.redis);

  // Set allowed topics
  let allowedTopics: Array<string> = cummareServerConfig.allowedTopics;

  // Delete all previous allowed topics
  allowedTopics.forEach((allowedTopic) => {
    redisHandler.deleteTopic(allowedTopic);
  })

  // Init server
  var cummareServer = new CummareServer(cummareServerConfig.bind, redisHandler, allowedTopics);

  // Start server
  cummareServer.start();
}

main();