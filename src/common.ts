import { exists } from "https://deno.land/std@0.79.0/fs/mod.ts";

export const BOX_RED = '\x1b[91m\u2588\x1b[0m';
export const BOX_GRN = '\x1b[92m\u2588\x1b[0m';
export const BOX_YEL = '\x1b[93m\u2588\x1b[0m';
export const BOX_BLU = '\x1b[94m\u2588\x1b[0m';
export const BOX_MAG = '\x1b[95m\u2588\x1b[0m';
export const BOX_CYN = '\x1b[96m\u2588\x1b[0m';
export const BOX_WHT = '\u2588';

let timer = 0;

export async function getInput(day: number): Promise<string> {
    const dayStr = day.toString().padStart(2, '0');
    const filePath = `./src/day${dayStr}/day${dayStr}_input.txt`;
    let data: string;

    if (await exists(filePath)) {
        data = await Deno.readTextFile(filePath);
    } else {
        const SESSION_ID = JSON.parse(Deno.readTextFileSync('config.json')).SESSION_ID;
        let response = await fetch(`https://adventofcode.com/2020/day/${day}/input`, {
            headers: {
                'Cookie': `session=${SESSION_ID}`,
            },
        });

        if (response.status == 200) {
            data = await response.text();
            Deno.writeTextFile(filePath, data);
        } else {
            throw `Get input for day ${day} failed: ${response.statusText}`;
        }
    }
    return data.trim();
}

export function tick() {
    timer = performance.now();
}

export function tock() {
    let elapsed = round(performance.now() - timer, 4);
    return `\x1b[96m${elapsed} ms\x1b[0m`
}

function round(num: number, decimalPlaces: number = 0) {
    var p = Math.pow(10, decimalPlaces);
    var m = (num * p) * (1 + Number.EPSILON);
    return Math.round(m) / p;
}