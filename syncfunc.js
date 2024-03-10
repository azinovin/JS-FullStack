import {calcfibo as fibo} from "./fibo.js";

async function Big(num) {
    return fibo(num);
}

function BigPromise(num) {
    return new Promise(function(resolve, reject) {
        resolve(fibo(num));
    });
}
let bignumber = Big(500);
console.log('1');
bignumber.then(value => console.log(`Вернули: ${value}`));
console.log('2')