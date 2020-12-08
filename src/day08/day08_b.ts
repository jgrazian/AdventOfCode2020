import { getInput, tick, tock } from '../common.ts';

const input = await getInput(8);

enum OpCode {
    Ret = -1,
    Nop = 0,
    Acc = 1,
    Jmp = 2
}

interface Op {
    name: string;
    code: OpCode;
}

const ops: Op[] = [
    {name: 'nop', code: OpCode.Nop},
    {name: 'acc', code: OpCode.Acc},
    {name: 'jmp', code: OpCode.Jmp}
];
const opNameMap: Map<string, Op> = new Map(ops.map(op => [op.name, op]));

class Computer {
    tape: Int32Array;
    acc: number = 0;
    ptr: number = 0;

    constructor(instructions: string) {
        this.tape = this.load(instructions);
    }

    doOp() {
        let op = this.tape[this.ptr + 0];
        let arg = this.tape[this.ptr + 1];
        if (op == OpCode.Nop) {
            this.ptr += 2;
            return true;
        } 
        if (op == OpCode.Acc) {
            this.acc += arg;
            this.ptr += 2;
            return true;
        } 
        if (op == OpCode.Jmp) {
            this.ptr += 2*arg;
            return true;
        }
        if (op == OpCode.Ret) {
            return false;
        }
    }

    /// Runs tape from ptr to ptr
    run(from?: number, to?: number): number {
        this.acc = 0;
        this.ptr = from || 0;

        while (this.doOp()) {
            if (this.ptr == to) {
                return this.acc;
            }
        }
        return this.acc;
    }

    findLoop(): number {
        this.ptr = 0;
        let seen = new Set();

        let prevPtr = 0;
        while (this.doOp()) {
            if (seen.has(this.ptr)) {
                return prevPtr;
            }
            seen.add(this.ptr);
            prevPtr = this.ptr;
        }
        return -1;
    }

    /// Fixes loop in tape memory and returns value of accumulator after fixing
    fixLoop(): number {
        this.ptr = 0;
        const badOpPtr = this.findLoop();

        let opStack:[number, OpCode][] = []; // [[ptrIdx, OpCode]]
        while (this.doOp()) {
            // We got to the spot where the infinite loop happens
            if (this.ptr == badOpPtr) break;

            // Hold onto nop and jmp to test later
            let opCode = this.tape[this.ptr];
            if (opCode == OpCode.Nop || opCode == OpCode.Jmp) {
                opStack.push([this.ptr, opCode]);
            }
        }

        // Test every nop/jmp in backlog to see if it was the one to cause the loop
        for (let [ptr, code] of opStack) {
            this.tape[ptr] = (code == OpCode.Nop) ? OpCode.Jmp : OpCode.Nop;
            if (this.findLoop() == -1) {
                return this.run();
            }
            this.tape[ptr] = (this.tape[ptr] == OpCode.Nop) ? OpCode.Jmp : OpCode.Nop; //Reset
        }
        return -1;
    }

    load(instructions: string): Int32Array {
        let tape = new Int32Array(Math.ceil(instructions.length / 3));
        let OpVal = instructions.matchAll(/(^\w*) ([+-]\d*)/gm);

        let ptr = 0;
        for (let [_, op, arg] of OpVal) {
            let opCode = opNameMap.get(op)!;
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
