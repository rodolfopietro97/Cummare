import { CummareClient } from './peers/CummareClient'

import { readFileSync } from 'fs';

/**
 * Simple SUBSCRIBE client.
 * 
 * It receives all topics by servers (SUBSCRIBE)
 */
function mainSubscribeClient() {
  // Set cummare server configuration from json file
  const cummareClientConfig = JSON.parse(
    readFileSync('./CummareClientConfig.json', 'utf-8')
  );

  // For each server binded send a message
  cummareClientConfig.serverBinds.forEach(serverBind => {
    // Creater a client
    var cummareClient = new CummareClient(serverBind)

    // Subscribe message request
    let call = cummareClient.subscribeTopic(cummareClientConfig.topic);
    call.on('data', function(response) {
      console.log( `\tReceived: '${response.getMessage()}' for topic '${cummareClientConfig.topic}''`);
    });
    call.on('end', function() {
        console.log(`Fetched all messages for topic '${cummareClientConfig.topic}'\n`)
    });
  });

}

mainSubscribeClient();