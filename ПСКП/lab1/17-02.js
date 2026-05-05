const redis = require("redis");

const client = redis.createClient({url: 'redis://:TJlPcE271tzThvOaGpvKVC4VrTmStAZp@redis-14153.c280.us-central1-2.gce.cloud.redislabs.com:14153'});

client.connect();

console.time('set');
for (let i = 1; i <= 10000; i++) {
    client.set(i.toString(), `set ${i}`);
}
console.timeEnd('set');

console.time('get');
for (let i = 1; i <= 10000; i++) {
    client.get(i.toString());
}
console.timeEnd('get');

console.time('del');
for (let i = 1; i <= 10000; i++) {
    client.del(i.toString());
}
console.timeEnd('del');

client.quit();