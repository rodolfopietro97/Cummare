import { CummareClient } from './peers/CummareClient'

import { readFileSync } from 'fs';

function mainClient() {
  // Set cummare server configuration
  const cummareClientConfig = JSON.parse(
    readFileSync('./CummareClientConfig.json', 'utf-8')
  );

  // Init server
  var cummareClient = new CummareClient(cummareClientConfig.serverBind)

  // Start server
  var message = "we", topic = "ou"
  cummareClient.publishMessage(message, topic, (ack) => {
      console.log("Server has received:" + message)
  });
}

mainClient();