import { CummareClient } from './peers/CummareClient'

import { readFileSync } from 'fs';

function mainClient() {
  // Set cummare server configuration
  const cummareClientConfig = JSON.parse(
    readFileSync('./CummareClientConfig.json', 'utf-8')
  );

  // Init server
  var cummareServer = new CummareClient(cummareClientConfig.serverBind)

  // Start server
  var message = "we", topic = "ou"
  cummareServer.publishMessage(message, topic, (ack) => {
      console.log("Server ha received:" + message)
  });
}

mainClient();