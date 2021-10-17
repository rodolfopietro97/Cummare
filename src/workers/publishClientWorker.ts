import { CummareClient } from "../peers/CummareClient";

/**
 * Simple publish client worker
 * 
 * @param cummareServer Cummare server address to send topic and message 
 * @param topic Topic of message
 * @param message Message to send
 */
export function publishClientWorker(cummareServer: string, topic: string, message: string): void {
    // Init cummare client
    let cummareClient: CummareClient = new CummareClient(cummareServer)

    // Publish message
    cummareClient.publishMessage(
        topic, // Topic
        message, // Message
        (ack) => { // Callback
            if (ack)
                console.log(`${cummareServer} - RECEIVED`);
            else
                console.log(`${cummareServer} - REJECTED`);
        });
}