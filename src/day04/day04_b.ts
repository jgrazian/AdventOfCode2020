import { getInput, tick, tock } from '../common.ts';

const input = await getInput(4);
const data = input.split('\n');
// Correct to make sure we check the last entry
if (data[data.length - 1] != '') {
    data.push('');
}

tick();
let passport = new Map([
    ['byr', ''],
    ['iyr', ''],
    ['eyr', ''],
    ['hgt', ''],
    ['hcl', ''],
    ['ecl', ''],
    ['pid', ''],
    ['cid', '']
]);

const validateMap = new Map([
    ['byr', validateByr],
    ['iyr', validateIyr],
    ['eyr', validateEyr],
    ['hgt', validateHgt],
    ['hcl', validateHcl],
    ['ecl', validateEcl],
    ['pid', validatePid],
    ['cid', validateCid]
]);

const re = /(byr|iyr|eyr|hgt|hcl|ecl|pid|cid):([#\w]*\b)/gm;

let validCount = 0;
for (let line of data) {
    if (line == '') {
        // Check every entry in passport for validity
        if ([...passport].every( kv => {
            let f = validateMap.get(kv[0]);
            return (f) ? f(kv[1]) : false; 
        })) {
            validCount++;
        }
        passport.forEach((v, k) => passport.set(k , '')); //reset passport values
    }

    let match = [...line.matchAll(re)];
    for (let m of match) {
        passport.set(m[1], m[2]);
    }
}

console.error(tock());
console.log(validCount);

// byr (Birth Year) - four digits; at least 1920 and at most 2002.
function validateByr(v: string): boolean {
    if (v.length != 4) {
        return false;
    }
    let num = Number(v);
    return (num >= 1920 && num <= 2002);
}
// iyr (Issue Year) - four digits; at least 2010 and at most 2020.
function validateIyr(v: string): boolean {
    if (v.length != 4) {
        return false;
    }
    let num = Number(v);
    return (num >= 2010 && num <= 2020);
}
// eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
function validateEyr(v: string): boolean {
    if (v.length != 4) {
        return false;
    }
    let num = Number(v);
    return (num >= 2020 && num <= 2030);
}
// hgt (Height) - a number followed by either cm or in:
// If cm, the number must be at least 150 and at most 193.
// If in, the number must be at least 59 and at most 76.
function validateHgt(v: string): boolean {
    let match = /(\d+)(in|cm)/gm.exec(v);
    if (!match) return false;
    let h = Number(match[1]);
    if (match[2] == 'cm') {
        return (h >= 150 && h <= 193);
    } else {
        return (h >=59 && h <= 76);
    }
}
// hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
function validateHcl(v: string): boolean {
    return /#[0-9a-f]{6}/gm.test(v);
}
// ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
function validateEcl(v: string): boolean {
    return /(amb|blu|brn|gry|grn|hzl|oth)/gm.test(v);
}
// pid (Passport ID) - a nine-digit number, including leading zeroes.
function validatePid(v: string): boolean {
    return /^\d{9}$/.test(v);
}
// cid (Country ID) - ignored, missing or not.
function validateCid(v: string): boolean {
    return true;
}