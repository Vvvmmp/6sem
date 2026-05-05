function getGCD(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function getGCDThree(a, b, c) {
    return getGCD(getGCD(a, b), c);
}

function findPrimesInRange(start, end) {
    const primes = [];
    const min = Math.max(2, start); 
    
    for (let i = min; i <= end; i++) {
        let isPrime = true;
        for (let j = 2; j <= Math.sqrt(i); j++) {
            if (i % j === 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) primes.push(i);
    }
    return primes;
}

const m = 431;
const n = 471;

console.log("=== exercise 1 ===");
const primesToN = findPrimesInRange(2, n);
const actualCount = primesToN.length;
const theoreticalCount = n / Math.log(n);

console.log(`All prime numbers in the range [2, ${n}]: ${actualCount}`);
console.log(`(n / ln(n)): ${theoreticalCount.toFixed(2)}`);

console.log("\n=== exercise 2 ===");
const primesInRange = findPrimesInRange(m, n);

console.log(`Find prime numbers in range [${m}, ${n}]:`);
console.log(primesInRange.join(', '));
console.log(`The number of prime numbers in the range: ${primesInRange.length}`);

console.log("\n=== check GCD ===");
console.log(`GCD(${m}, ${n}) = ${getGCD(m, n)}`);
console.log(`Example GCD with (48, 64, 16 numbers: ${getGCDThree(45, 64, 22)}`);