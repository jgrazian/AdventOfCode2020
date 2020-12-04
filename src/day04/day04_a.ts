import { getInput, tick, tock } from '../common.ts';

const input = await getInput(4);
const data = input.split('\n');
if (data[data.length - 1] != '') {
    data.push('');
}

tick();
let passport = new Map(
    [
        ['byr', ''],
        ['iyr', ''],
        ['eyr', ''],
        ['hgt', ''],
        ['hcl', ''],
        ['ecl', ''],
        ['pid', ''],
        ['cid', '']
    ]);

const re = /(byr|iyr|eyr|hgt|hcl|ecl|pid|cid):([#\w]*\b)/gm;

let validCount = 0;
for (let line of data) {
    if (line == '') {
        if ([...passport].every( kv => (kv[1] != '') || (kv[0] == 'cid') )) {
            validCount++;
        }
        passport.forEach((v, k) => passport.set(k , ''));
    }

    let match = [...line.matchAll(re)];
    for (let m of match) {
        passport.set(m[1], m[2]);
    }
}

console.error(tock());
console.log(validCount);
