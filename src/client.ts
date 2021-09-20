import { CummareClient } from './peers/CummareClient'

import { readFileSync } from 'fs';

/**
 * Simple client.
 * 
 * It does 2 main tasks
 *    Send message and topic to servers (PUBLISH)
 *    Receive all topics by servers (SUBSCRIBE)
 */
function mainClient() {
  // Set cummare server configuration from json file
  const cummareClientConfig = JSON.parse(
    readFileSync('./CummareClientConfig.json', 'utf-8')
  );

  // For each server binded send a message
  cummareClientConfig.serverBinds.forEach(serverBind => {
    // Creater a client
    var cummareClient = new CummareClient(serverBind)

    // Send message request
    cummareClient.publishMessage(cummareClientConfig.topic, JSON.stringify(cummareClientConfig.message), (ack) => {
      if (ack)
        console.log(`${serverBind} has received message`)
      else
        console.log(`${serverBind} has NOT received message`)
    });
  });

}

mainClient();