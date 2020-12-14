const input = `1003240
19,x,x,x,x,x,x,x,x,41,x,x,x,37,x,x,x,x,x,787,x,x,x,x,x,x,x,x,x,x,x,x,13,x,x,x,x,x,x,x,x,x,23,x,x,x,x,x,29,x,571,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,17`;
const data = input.split('\n');
const buses = data[1].split(',');
let idOff = [];
for(let i = 0; i < buses.length; i++){
    if (buses[i] == 'x') continue;
    idOff.push({
        id: parseInt(buses[i]),
        offset: i
    });
}
const n = idOff.map((v)=>v.id
);
const a = idOff.map((v)=>v.id - v.offset
);
const N = n.reduce((p, c)=>p * c
);
const np = n.map((ni)=>N / ni
);
const u = [];
for(let i1 = 0; i1 < np.length; i1++){
    let j = 1;
    while(true){
        if (np[i1] * j % n[i1] == 1) {
            break;
        } else {
            j++;
        }
    }
    u.push(j);
}
let ans = BigInt(0);
for(let i2 = 0; i2 < np.length; i2++){
    ans += BigInt(a[i2] * np[i2] * u[i2]);
}
console.log(ans % BigInt(N));
