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
    tape: Int16Array;
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

    load(instructions: string): Int16Array {
        let tape = new Int16Array(Math.ceil(instructions.length / 3));
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
let ans = c.run(0, c.findLoop());

console.error(tock());
console.log(ans);
