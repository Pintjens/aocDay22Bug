import { log } from "console";
import fs from "fs";

const ex = true;
const inputPath = ex ? "exInput.txt" : "puzzleInput.txt";

const input = fs.readFileSync(inputPath).toString("utf8").split("\r\n");

const mix = (secretNumber, mixNumber) => {
    return secretNumber ^ mixNumber;
}
const prune = (secretNumber) => {
    return secretNumber % BigInt(16777216);
}

// possible profitable patterns:
// total chang cant be -9
// rewrite this to be more effective?
// check if there are any more impossible patterns that are left in this way
let possibleProfitablePatterns = {};
for(let i = -9; i <= 9; i++){
    for(let j = -9; j <= 9; j++){
        if(i+j > -10){
            for(let k = -9; k <= 9; k++){
                if(i+j+k > -10){
                    for(let l = -9; l <= 9; l++){
                        if(i+j+k+l > -9){
                            possibleProfitablePatterns[`${i},${j},${k},${l}`] = {status: true, count: 0};
                        }
                    }
                }
            }
        }
    }   
}


const calculateSecret = (secretNumber) => {
    secretNumber = BigInt(secretNumber)
    secretNumber = prune(mix(secretNumber, secretNumber * BigInt(64)));
    let test = secretNumber/BigInt(32);
    secretNumber = prune(mix(secretNumber, test-(test%BigInt(1))));
    secretNumber = prune(mix(secretNumber, secretNumber*BigInt(2048)));

    return secretNumber;
}

let total = BigInt(0);
input.forEach((secret, index) => {
    let changes = [-10,-10,-10,-10];
    let numbers = [-1,-1,-1,-1,secret];
    let lastPrice = +(secret.toString(10)) % 10;
    for(let i = 0; i < 2000; i++){

        secret = calculateSecret(secret);
        numbers.shift()
        numbers.push(secret);
        changes.shift();
        const price = +(secret.toString(10))%10;
        changes.push(price-lastPrice);
        lastPrice = price;
        if(possibleProfitablePatterns[changes.toString()] && possibleProfitablePatterns[changes.toString(10)].status){
            possibleProfitablePatterns[changes.toString()].status = false;
            possibleProfitablePatterns[changes.toString()].count += price;
        }
        if(changes.toString() == "-9,9,-1,0"){
            log(`Secret ${index+1} hits:`, numbers.map(x => +x.toString(10)), `After iteration: ${i}`);
        }

    }
    for (const [key, value] of Object.entries(possibleProfitablePatterns)) {
        value.status = true;
    }
    total += secret;
});

let max = 0;
let pattern;
for (const [key, value] of Object.entries(possibleProfitablePatterns)) {
    if(value.count > max){
        max = value.count;
        pattern = key;
    } 
}

log(pattern, max)

log("Part 1: ", total.toString(10), total == 37327623 || total == 20441185092);
log("Part 2: ", max, max == 2268);
