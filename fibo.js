function* getFibonacci() {
    let a = 0;
    let b = 1;
    for(let i=0; ; i++) {
        let sum = a + b;
        yield sum;
        a = b;
        b = sum;
    }
}
function calcfibo(num) {
    let result = 0
    const fibonacci = getFibonacci();
    for(let i = 0; i < num; i++) {
       result = fibonacci.next().value;
    }
    return result;
}

export {calcfibo}