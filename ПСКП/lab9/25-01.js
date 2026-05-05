const JsonRPCServer = require('jsonrpc-server-http-nats');

const server = new JsonRPCServer();

let bin_validator_sum_mul = param => {
    console.log('param: ', param);
    if(!Array.isArray(param))
        throw new Error('Ожидается массив');
    if(param.length < 2)
        throw new Error('Ожидается 2 значения и больше');
    if(!isFinite(param[0]) || !isFinite(param[1]))
        throw new Error('Ожидается число')
    return param;
};

let bin_validator_div_proc = param => {
    console.log('param: ', param);
    if(!Array.isArray(param))
        throw new Error('Ожидается массив');
    if(param.length != 2)
        throw new Error('Ожидается 2 значения');
    if(!isFinite(param[0]) || !isFinite(param[1]))
        throw new Error('Ожидается число')
    if(param[1] == 0)
        throw new Error('Число не может быть равно 0');
    return param;
};

server.on('sum', bin_validator_sum_mul, (params, channel, res) => {
    let sum = 0;
    for (let i = 0; i < params.length; i++){
        sum += params[i];
    }
    console.log('sum: ', sum, '\n');
    res(null, sum);
});

server.on('mul', bin_validator_sum_mul, (params, channel, res) => {
    let mul = 1;
    for (let i = 0; i < params.length; i++){
        mul *= params[i];
    }
    console.log('mul: ', mul, '\n');
    res(null, mul);
});

server.on('div', bin_validator_div_proc, (params, channel, res) => {
    let div = params[0] / params[1];
    console.log('div: ', div, '\n');
    res(null, div);
});

server.on('proc', bin_validator_div_proc, (params, channel, res) => {
    let proc = params[0] / params[1] * 100;
    console.log('proc: ', proc, '\n');
    res(null, proc);
});

server.listenHttp(
    {
        host: '127.0.0.1',
        port: 3000
    },
    () => console.log('Server running at http://localhost:3000')
);


