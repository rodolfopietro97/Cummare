import assert from 'assert'

import { publishClientWorker } from './workers/publishClientWorker';

/**
 * Simple PUBLISH client.
 * 
 * It sends message and topic to servers (PUBLISH)
 */
function mainPublishClient() {
  /*
   * Get configuration parameters
   */
  // Init topic, message and cummare server address
  var topic: string = "", message: string = "", cummareServerAddress: string = "";

  // Assert syntax of publish client
  // TODO: Improove argv handling part
  try {
    // Correct number of arguments
    assert.equal(process.argv.length, 5);

    // Message is a json object
    assert.equal(typeof (JSON.parse(process.argv[4])) === 'object', true);
    message = process.argv[4];

    // Init topic
    // TODO: view if control if topic is in allowed topics
    topic = process.argv[3];

    // Init cummare server address
    cummareServerAddress = process.argv[2];
  }
  catch (error) {
    console.error("Invalid syntax. You must use: 'publish.js {cummare_server} {topic} {\"message\"}'" + 
    "\nWhere:\n\t{cummare_server} is the pair ip:port of Cummare Server\n\t{topic}: Is the topic where message is published\n\t{\"message\"}: Is the message in JSON format")
    process.exit(-1)
  }

  /*
   * Publish message
   */
  publishClientWorker(cummareServerAddress, topic, message)

}

mainPublishClient();