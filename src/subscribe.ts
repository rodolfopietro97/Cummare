import { subscribeClientWorker } from './workers/subscribeClientWorker';

/**
 * Simple SUBSCRIBE client.
 * 
 * It receives all topics by servers (SUBSCRIBE)
 */
function mainSubscribeClient() {

  // Subscribe to topic
  subscribeClientWorker("127.0.0.1:50052", "transaction");

}

mainSubscribeClient();