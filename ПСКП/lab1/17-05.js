const redis = require("redis");

const url = 'redis://:TJlPcE271tzThvOaGpvKVC4VrTmStAZp@redis-14153.c280.us-central1-2.gce.cloud.redislabs.com:14153';

const client_subscriber = redis.createClient({ url });
const client_publisher = redis.createClient({ url });

async function leave() {
await client_subscriber.connect();
await client_publisher.connect();
await client_subscriber.subscribe('channel-01', (message) => { console.log('received ' + message);});   

for(let i = 1; i <= 10; i++){
    await client_publisher.publish('channel-01', `message ${i}`);
};

    await client_subscriber.unsubscribe('channel-01');
    await client_subscriber.quit();
    await client_publisher.quit();
}
leave();