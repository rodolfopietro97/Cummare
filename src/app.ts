import { CummareServer } from './peers/CummareServer'

import { readFileSync } from 'fs';

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  // Set cummare server configuration
  const cummareServerConfig = JSON.parse(
    readFileSync('./CummareServerConfig.json', 'utf-8')
  );

  // Init server
  var cummareServer = new CummareServer(cummareServerConfig.binds)

  // Start server
  cummareServer.start()
}

main();