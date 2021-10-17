import { CummareServer } from './peers/CummareServer'

import { readFileSync } from 'fs';

import { RedisHandler } from './redis_handler/RedisHandler'

import assert from 'assert'
import { refresherWorker } from './workers/refresherWorker';
import { viewerWorker } from './workers/viewerWorker';

/**
 * Cummare main server.
 * 
 * It can be runned as Server, Viewer and Refresher
 */
function main() {
    /*
     * Get configuration parameters
     */
    // Assert if config file and running type is not passed in main arguments
    // TODO: Improove argv handling part
    try {
        // Correct number of arguments
        assert.equal(process.argv.length, 4);

        // JSON configuration files (2nd position) must be a .json file
        assert.equal(process.argv[2].includes('.json'), true)

        // JSON configuration files (2nd position) must be a .json file
        let correctRunningMode: boolean = (process.argv[3] == 'server' || process.argv[3] == 'refresher' || process.argv[3] == 'viewer')
        assert.equal(correctRunningMode, true)
    }
    catch (error) {
        console.error("Invalid syntax. You must use: 'app.js {configuration_file.json} {running_mode}'\nWhere {running_mode} can be:\n\t'server': Server mode\n\t'refresher': Refresher mode\n\t'viewer': Viewer mode")
        process.exit(-1)
    }

    // Cummare server configuration form json file
    const cummareServerConfig = JSON.parse(
        readFileSync(process.argv[2], 'utf-8')
    );

    // Redis client
    const redisHandler = new RedisHandler(cummareServerConfig.redis)

    /*
     * Run correct program
     */
    switch (process.argv[3]) {
        // Server mode
        case 'server':
            // Delete all previous allowed topics
            cummareServerConfig.allowedTopics.forEach((allowedTopic) => {
                redisHandler.deleteTopic(allowedTopic);
            })

            // Init server
            var cummareServer = new CummareServer(cummareServerConfig.bind, redisHandler, cummareServerConfig.allowedTopics);

            // Start server
            cummareServer.start();
            break;

        // Refresher mode
        case 'refresher':
            /*
            * Verify topics update
            */
            setInterval(() => {

                // For each allowed topic
                cummareServerConfig.allowedTopics
                    .forEach(async (allowedTopic) => {

                        // Start refresher worker for a specific topic
                        // TODO try parallelization
                        await refresherWorker(cummareServerConfig, redisHandler, allowedTopic)

                    });

            }, cummareServerConfig.doUpdateEveryMilliseconds) // Do this task every 'doUpdateEveryMilliseconds'
            break;

        // Viewer
        case 'viewer':
            /*
            * List topics
            */
            setInterval(() => {
                // Clear console
                console.clear()

                // For each allowed topic
                cummareServerConfig.allowedTopics
                    .forEach(async (allowedTopic) => {

                        // Start viewer worker for a specific topic
                        // TODO try parallelization
                        viewerWorker(cummareServerConfig, redisHandler, allowedTopic);

                    });

            }, cummareServerConfig.viewEveryMilliseconds) // View messages every 'viewEveryMilliseconds'
            break;
    }
}

/**
 * Start main loop
 */
main();