const redis = require("redis");

const client = redis.createClient({url: 'redis://:TJlPcE271tzThvOaGpvKVC4VrTmStAZp@redis-14153.c280.us-central1-2.gce.cloud.redislabs.com:14153'});

client.connect();

client.set('incr', 0);
client.get('incr');

console.time('incr');
for (let i = 1; i <= 10000; i++) {
    client.incr('incr')
}
console.timeEnd('incr');

client.get('incr');

console.time('decr');
for (let i = 1; i <= 10000; i++) {
    client.decr('incr');
}
console.timeEnd('decr');

client.get('incr');

client.quit();