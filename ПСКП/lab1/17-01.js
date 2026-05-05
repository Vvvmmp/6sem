const redis = require("redis");

const client = redis.createClient({url: 'redis://:TJlPcE271tzThvOaGpvKVC4VrTmStAZp@redis-14153.c280.us-central1-2.gce.cloud.redislabs.com:14153'});

client.on("ready", () => console.log("ready"));
client.on("error", (err) => console.log("error: " + err));
client.on("connect", () => console.log("connect"));
client.on("end", () => console.log("end"));

 async function run() {
     await client.connect();
     await client.quit();
 }
 run();


