import assert from 'assert'

import { subscribeClientWorker } from './workers/subscribeClientWorker';

/**
 * Simple SUBSCRIBE client.
 * 
 * It receives all topics by servers (SUBSCRIBE)
 */
function mainSubscribeClient() {
  /*
   * Get configuration parameters
   */
  // Init topic, and cummare server address
  var topic: string = "", cummareServerAddress: string = "";

  // Assert syntax of publish client
  // TODO: Improove argv handling part
  try {
    // Correct number of arguments
    assert.equal(process.argv.length, 4);

    // Init topic
    // TODO: view if control if topic is in allowed topics
    topic = process.argv[3];

    // Init cummare server address
    cummareServerAddress = process.argv[2];
  }
  catch (error) {
    console.error("Invalid syntax. You must use: 'subscribe.js {cummare_server} {topic}" + 
    "\nWhere:\n\t{cummare_server} is the pair ip:port of Cummare Server\n\t{topic}: Is the topic where we want subscribe messages")
    process.exit(-1)
  }

  // Subscribe to topic
  subscribeClientWorker(cummareServerAddress, topic);

}

mainSubscribeClient();