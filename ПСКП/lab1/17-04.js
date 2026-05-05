const redis = require("redis");

const client = redis.createClient({url: 'redis://:TJlPcE271tzThvOaGpvKVC4VrTmStAZp@redis-14153.c280.us-central1-2.gce.cloud.redislabs.com:14153'});

client.connect();

client.set('incr', 0);

console.time('hSet');
for (let i = 1; i <= 10000; i++) {
    client.hSet(i.toString(), 'incr', `{id: ${i}, val: "val-${i}"}`);
}
console.timeEnd('hSet');

console.time('hGet');
for (let i = 1; i <= 10000; i++) {
    client.hGet(i.toString(), 'incr');
}
console.timeEnd('hGet');

client.quit();