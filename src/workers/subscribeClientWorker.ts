import { CummareClient } from "../peers/CummareClient";

/**
 * Simple subscribe client worker
 * 
 * @param cummareServer Cummare server address to subscribe
 * @param topic Topic of message
 */
export function subscribeClientWorker(cummareServer: string, topic: string): void {
    // Init cummare client
    let cummareClient: CummareClient = new CummareClient(cummareServer)

    // Subscribe topic
    let call = cummareClient.subscribeTopic(topic);
    call.on('data', function (response) {
      console.log(response.getMessage())
    });
    call.on('end', function () {
      console.log("END")
    });
}