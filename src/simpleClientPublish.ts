import { CummareClient } from './peers/CummareClient'

import { readFileSync } from 'fs';

/**
 * Simple PUBLISH client.
 * 
 * It sends message and topic to servers (PUBLISH)
 */
function mainPublishClient() {
  // Set cummare server configuration from json file
  const cummareClientConfig = JSON.parse(
    readFileSync('./CummareClientConfig.json', 'utf-8')
  );

  // For each server binded send a message
  cummareClientConfig.serverBinds.forEach(serverBind => {
    // Creater a client
    var cummareClient = new CummareClient(serverBind)

    // Publish message request
    cummareClient.publishMessage(
      cummareClientConfig.topic, // Topic
      JSON.stringify(cummareClientConfig.message), // Message
      (ack) => { // Callback
        if (ack)
          console.log(`${serverBind} has received message`)
        else
          console.log(`${serverBind} has NOT received message`)
    });
  });
}

mainPublishClient();