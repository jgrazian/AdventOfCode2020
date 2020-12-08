import { getInput, tick, tock } from '../common.ts';

const input = await getInput(8);
const operations = input.split('\n');

enum OpCode {
    Err = -2,
    Ret = -1,
    Nop = 0,
    Acc = 1,
    Jmp = 2
}

interface Op {
    name: string;
    code: OpCode;
    fn: (acc: number, ptr: number, ...ops: number[]) => [number, number];
}

const ops: Op[] = [
    {name: 'nop', code: OpCode.Nop, fn: (acc: number, ptr: number, ...ops: number[]) => [acc, ptr + 2]},
    {name: 'acc', code: OpCode.Acc, fn: (acc: number, ptr: number, ...ops: number[]) => [acc + ops[0], ptr + 2]},
    {name: 'jmp', code: OpCode.Jmp, fn: (acc: number, ptr: number, ...ops: number[]) => [acc, ptr + 2*ops[0]]}
];
const opNameMap: Map<string, Op> = new Map(ops.map(op => [op.name, op]));
const opCodeMap: Map<number, Op> = new Map(ops.map(op => [op.code, op]));

class Computer {
    tape: Int16Array;
    working: Int16Array; //Copy of tape to be mutated between runs if neccisary
    accumulator: number = 0;
    ptr: number = 0;

    constructor(instructions: string) {
        this.tape = this.load(instructions);
        this.working = this.tape.slice();
    }

    run(): number {
        this.accumulator = 0;
        this.ptr = 0;

        let opCode = this.working[this.ptr];
        while (opCode != OpCode.Ret) {
            let op = opCodeMap.get(opCode);
            if (!op) {
                throw `Unknown op code: ${opCode}`
            }
            [this.accumulator, this.ptr] = op.fn(this.accumulator, this.ptr, this.working[this.ptr + 1]);
            opCode = this.working[this.ptr];
        }
        return this.accumulator;
    }

    runTo(ptrIdx: number): number {
        this.working = this.tape.slice();
        this.working[ptrIdx] = OpCode.Ret;

        const res = this.run();
        this.working = this.tape.slice();

        return res;
    }

    findLoop(): number {
        this.accumulator = 0;
        this.ptr = 0;
        
        let opCode = this.working[this.ptr];
        while (opCode != OpCode.Ret) {
            let op = opCodeMap.get(opCode);
            if (!op) {
                throw `Unknown op code: ${opCode}`
            }
            this.working[this.ptr] = OpCode.Err; // Set visited op codes to break (-1)
            let prevPtr = this.ptr;
            [this.accumulator, this.ptr] = op.fn(this.accumulator, this.ptr, this.working[this.ptr + 1]);
            opCode = this.working[this.ptr];

            if (opCode == OpCode.Err) {
                return prevPtr;
            }
        }
        return -1; //
    }

    load(instructions: string): Int16Array {
        let tape = new Int16Array(Math.ceil(instructions.length / 3));
        let OpVal = instructions.matchAll(/(^\w*) ([+-]\d*)/gm);

        let ptr = 0;
        for (let [_, op, arg] of OpVal) {
            let opCode = opNameMap.get(op);
            if (opCode == null) {
                throw `Unkown op name: ${op}`;
            }
            tape[ptr + 0] = opCode.code;
            tape[ptr + 1] = parseInt(arg);
            ptr += 2;
        }
        tape[ptr + 0] = OpCode.Ret; // -1 to end tape
        return tape;
    }
}

tick();
let c = new Computer(input);
let ans = c.runTo(c.findLoop());

console.log(tock());
console.log(ans);
