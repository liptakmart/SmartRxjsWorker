// to reference mozes odstranit
/// <reference lib="webworker"/>
var parseFn = require('./json-fn.ts').parseFn;

addEventListener('message', ({ data }) => {
    const myFunction = parseFn(data.func, null);//JSON.parse(data.func);
    let res = myFunction(...data.payload);
    postMessage(res);
});
