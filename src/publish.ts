import { publishClientWorker } from './workers/publishClientWorker';

/**
 * Simple PUBLISH client.
 * 
 * It sends message and topic to servers (PUBLISH)
 */
function mainPublishClient() {

  // Publish message
  publishClientWorker("127.0.0.1:50052", "transaction", `{"from":"alice2","to":"bob","amount":454434543}`)

}

mainPublishClient();