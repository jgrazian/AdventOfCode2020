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
    working: Int16Array; //Copy of tape to be mutated between runs if needed.
    accumulator: number = 0;
    ptr: number = 0;

    constructor(instructions: string) {
        this.tape = this.load(instructions);
        this.working = this.tape.slice();
    }

    /// Runs working memory
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

    /// Resets working memory to tape and runs to specified ptr index
    runTo(ptrIdx: number): number {
        this.working = this.tape.slice();
        this.working[ptrIdx] = OpCode.Ret;

        const res = this.run();
        this.working = this.tape.slice();

        return res;
    }

    /// Checks working memory for loop, returns ptr index of op that causes loop or -1 if no loop found
    findLoop(): number {
        this.accumulator = 0;
        this.ptr = 0;
        
        let opCode = this.working[this.ptr];
        while (opCode != OpCode.Ret) {
            let op = opCodeMap.get(opCode);
            if (!op) {
                throw `Unknown op code: ${opCode}`
            }
            this.working[this.ptr] = OpCode.Err; // Set visited op codes to err (-2)
            let prevPtr = this.ptr;
            [this.accumulator, this.ptr] = op.fn(this.accumulator, this.ptr, this.working[this.ptr + 1]);
            opCode = this.working[this.ptr];

            if (opCode == OpCode.Err) {
                return prevPtr;
            }
        }
        return -1; //No err found -> no loop
    }

    /// Fixes loop in tape memory and returns value of accumulator after fixing
    fixLoop(): number {
        const badOpPtr = this.findLoop();

        this.working = this.tape.slice();
        this.accumulator = 0;
        this.ptr = 0;

        let lastOpPtr: number[] = [];
        let lastOpCode: OpCode[] = [];

        let opCode = this.working[this.ptr];
        while (opCode != OpCode.Ret) {
            // We got to the spot where the infinite loop occours
            if (this.ptr == badOpPtr) {
                break;
            }
            let op = opCodeMap.get(opCode);
            if (!op) {
                throw `Unknown op code: ${opCode}`
            }
            // Hold onto location of nop and jmp
            if (op.code == OpCode.Nop || op.code == OpCode.Jmp) {
                lastOpPtr.push(this.ptr);
                lastOpCode.push(op.code);
            }
            [this.accumulator, this.ptr] = op.fn(this.accumulator, this.ptr, this.working[this.ptr + 1]);
            opCode = this.working[this.ptr];
        }

        // Test every ptr in backlog to see if it was the one to cause the loop
        let isLoop = true;
        let curOpPtr = 0;
        let curOpCode = OpCode.Nop;
        while (isLoop) {
            this.working = this.tape.slice();
            curOpPtr = lastOpPtr.pop()!;
            curOpCode = lastOpCode.pop()!;
            this.working[curOpPtr] = (curOpCode == OpCode.Nop) ? OpCode.Jmp : OpCode.Nop;
            isLoop = this.findLoop() != -1;
        }
        // Reset one more time and fix the loop
        this.working = this.tape.slice();
        this.working[curOpPtr] = (curOpCode == OpCode.Nop) ? OpCode.Jmp : OpCode.Nop;

        return this.run();
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
let ans = c.fixLoop();

console.log(tock());
console.log(ans);
