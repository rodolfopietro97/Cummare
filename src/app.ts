import { CummareServer } from './peers/CummareServer'

import { readFileSync } from 'fs';


import { RedisHandler } from './redis_handler/RedisHandler'

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  // let REDIS_SERVER = {
  //     'host': '1.0.0.10',
  //     'port': 6379,
  //     'database': 0,
  //     'connection_timeout': 5
  // }

  // Set cummare server configuration
  const cummareServerConfig = JSON.parse(
    readFileSync('./CummareServerConfig.json', 'utf-8')
  );

  const redisCLient = new RedisHandler(cummareServerConfig.redis)

  let topic = "transaction"

  redisCLient.deleteTopic(topic)

  setInterval(() => {
    redisCLient.setTopic(topic, JSON.stringify({ from: 'address1', to: 'address2' }))
  }, 1000)

  setInterval(async () => {
    let topicsUpdate = (await redisCLient.getTopic(topic)).filter(
      currentTopic => {
        let elapsed = Date.now() - Number(JSON.parse(currentTopic).timestamp)
        console.log(elapsed)
        return elapsed <= 10
      }
    )
    console.log(topicsUpdate)
    // redisCLient.setTopic(topic, JSON.stringify({ from: 'address1', to: 'address2' }))
  }, 1000)
  
  setInterval(async () => {
    // console.log(await redisCLient.getTopic(topic))
  }, 1000)

  // Init server
  var cummareServer = new CummareServer(cummareServerConfig.binds)

  // Start server
  cummareServer.start()
}

main();