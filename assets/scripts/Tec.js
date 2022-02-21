const resize=()=>{
    document.documentElement.style.setProperty("--w_total",window.innerWidth/100.0+"px");
    document.documentElement.style.setProperty("--h_total",window.innerHeight/100.0+"px");
}
resize();
window.onresize=resize;

let power_sw=document.getElementById("power");

let run_lamp=document.getElementById("run_lamp");

let reset_sw=document.getElementById("reset");

let a0_lamp=document.getElementById("a0_lamp");
let a1_lamp=document.getElementById("a1_lamp");
let a2_lamp=document.getElementById("a2_lamp");
let a3_lamp=document.getElementById("a3_lamp");

let a4_lamp=document.getElementById("a4_lamp");
let a5_lamp=document.getElementById("a5_lamp");
let a6_lamp=document.getElementById("a6_lamp");
let a7_lamp=document.getElementById("a7_lamp");
let a_lamps=[
    a0_lamp,
    a1_lamp,
    a2_lamp,
    a3_lamp,

    a4_lamp,
    a5_lamp,
    a6_lamp,
    a7_lamp
];

let d0_lamp=document.getElementById("d0_lamp");
let d1_lamp=document.getElementById("d1_lamp");
let d2_lamp=document.getElementById("d2_lamp");
let d3_lamp=document.getElementById("d3_lamp");

let d4_lamp=document.getElementById("d4_lamp");
let d5_lamp=document.getElementById("d5_lamp");
let d6_lamp=document.getElementById("d6_lamp");
let d7_lamp=document.getElementById("d7_lamp");
let d_lamps=[
    d0_lamp,
    d1_lamp,
    d2_lamp,
    d3_lamp,

    d4_lamp,
    d5_lamp,
    d6_lamp,
    d7_lamp
];

let left_sw=document.getElementById("left");
let g0_lamp=document.getElementById("g0_lamp");
let g1_lamp=document.getElementById("g1_lamp");
let g2_lamp=document.getElementById("g2_lamp");
let sp_lamp=document.getElementById("sp_lamp");
let pc_lamp=document.getElementById("pc_lamp");
let mm_lamp=document.getElementById("mm_lamp");
let r_lamps=[
    g0_lamp,
    g1_lamp,
    g2_lamp,
    sp_lamp,
    pc_lamp,
    mm_lamp
];
let right_sw=document.getElementById("right");

let c_lamp=document.getElementById("c_lamp");
let s_lamp=document.getElementById("s_lamp");
let z_lamp=document.getElementById("z_lamp");

let f_lamps=[
    c_lamp,
    s_lamp,
    z_lamp
];

let d0_sw=document.getElementById("d0_sw");
let d1_sw=document.getElementById("d1_sw");
let d2_sw=document.getElementById("d2_sw");
let d3_sw=document.getElementById("d3_sw");

let d4_sw=document.getElementById("d4_sw");
let d5_sw=document.getElementById("d5_sw");
let d6_sw=document.getElementById("d6_sw");
let d7_sw=document.getElementById("d7_sw");
let d_sws=[
    d0_sw,
    d1_sw,
    d2_sw,
    d3_sw,

    d4_sw,
    d5_sw,
    d6_sw,
    d7_sw
];

let breac_sw=document.getElementById("breac");
let step_sw=document.getElementById("step");
let run_sw=document.getElementById("run");
let stop_sw=document.getElementById("stop");

let seta_sw=document.getElementById("seta");
let inca_sw=document.getElementById("inca");
let deca_sw=document.getElementById("deca");
let write_sw=document.getElementById("write");

let toggles=document.getElementsByClassName("toggle");
let t_labels=document.getElementsByClassName("t_label");
let t_status=new Array(toggles.length);
for(let i=0;i<toggles.length;i++){
    t_status[i]=false;
    toggles[i].onclick=()=>{
        t_status[i]=!t_status[i];
        toggles[i].checked=t_status[i];
    }
    t_labels[i].onclick=()=>{
        t_status[i]=!t_status[i];
        toggles[i].checked=t_status[i];
    }
}


const BYTE=8;

//Tec
const G0=0;
const G1=1;
const G2=2;
const SP=3;
const PC=4;
const MM=5;

const C=0;
const S=1;
const Z=2;

const REGISTER_LENGTH=5;
const MAIN_MEMORY_LENGTH=0x100;
const FLAG_LENGTH=3;

class Tec{
    register;
    flag;
    main_memory;
    interruptable;

    power=false;
    rotary;
    addressToDisp;
    running=false;
    error=false;

    gui;
    sound;
    constructor(gui,sound){
        this.gui=gui;
        this.sound=sound;
        this.off();
    }

    power_sw(){
        this.power=!this.power;
        if(this.power){
            this.on();
        }else{
            this.off();
        }
    }
    on(){
        this.register=new Int16Array(REGISTER_LENGTH);
        this.main_memory=new Int16Array(MAIN_MEMORY_LENGTH);
        this.initializeMemory();
        this.flag=new Array(FLAG_LENGTH);
        for(let i=0;i<FLAG_LENGTH;i++){
            this.flag[i]=false;
        }
        this.interruptable=false;
        this.rotary=G0;
        this.addressToDisp=0x00;
        this.gui.setPowerLamp(true);
        this.gui.setRotaryLamp(G0,true);
        this.display();
        this.sound.playSound();
    }
    off(){
        this.running=false;
        this.error=false;
        this.gui.setPowerLamp(false);
        for(let i=G0;i<=MM;i++){
            this.gui.setRotaryLamp(i,false);
        }
        for(let i=0;i<BYTE;i++){
            this.gui.setAddressLamp(i,false);
            this.gui.setDataLamp(i,false);
        }
    }
    initializeMemory(){
        this.main_memory[0xe0]=0x1f;
        this.main_memory[0xe1]=0xdc;
        this.main_memory[0xe2]=0xb0;
        this.main_memory[0xe3]=0xf6;
        this.main_memory[0xe4]=0xd0;
        this.main_memory[0xe5]=0xd6;
        this.main_memory[0xe6]=0xb0;
        this.main_memory[0xe7]=0xf6;
        this.main_memory[0xe8]=0xd0;
        this.main_memory[0xe9]=0xda;
        this.main_memory[0xea]=0xa4;
        this.main_memory[0xeb]=0xff;
        this.main_memory[0xec]=0xb0;
        this.main_memory[0xed]=0xf6;
        this.main_memory[0xee]=0x21;
        this.main_memory[0xef]=0x00;
        this.main_memory[0xf0]=0x37;
        this.main_memory[0xf1]=0x01;
        this.main_memory[0xf2]=0x4b;
        this.main_memory[0xf3]=0x01;
        this.main_memory[0xf4]=0xa0;
        this.main_memory[0xf5]=0xea;
        this.main_memory[0xf6]=0xc0;
        this.main_memory[0xf7]=0x03;
        this.main_memory[0xf8]=0x63;
        this.main_memory[0xf9]=0x40;
        this.main_memory[0xfa]=0xa4;
        this.main_memory[0xfb]=0xf6;
        this.main_memory[0xfc]=0xc0;
        this.main_memory[0xfd]=0x02;
        this.main_memory[0xfe]=0xec;
        this.main_memory[0xff]=0xff;
    }
    rotary_sw(left){
        if(this.power){
            if(left){
                if(this.rotary!==G0){
                    this.gui.setRotaryLamp(this.rotary,false);
                    this.gui.setRotaryLamp(--this.rotary,true);
                    this.display();
                    this.sound.playSound();
                }
            }else{
                if(this.rotary!==MM){
                    this.gui.setRotaryLamp(this.rotary,false);
                    this.gui.setRotaryLamp(++this.rotary,true);
                    this.display();
                    this.sound.playSound();
                }
            }
        }
    }
    i_d_sw(inca){
        if(this.power&&(this.rotary===MM)){
            if(inca){
                if(this.addressToDisp===0xff){
                    this.addressToDisp=0x00;
                }else{
                    this.addressToDisp++;
                }
            }else{
                if(this.addressToDisp===0x00){
                    this.addressToDisp=0xff;
                }else{
                    this.addressToDisp--;
                }
            }
            this.display();
            this.sound.playSound();
        }
    }
    seta_sw(){
        if(this.power&&(this.rotary===MM)){
            this.addressToDisp=this.gui.getData();
            this.display();
            this.sound.playSound();
        }
    }
    write_sw(){
        if(this.power&&(!this.running)){
            if(this.rotary==MM){
                this.write(this.addressToDisp,this.gui.getData());
                this.i_d_sw(true);
            }else{
                this.register[this.rotary]=this.gui.getData();
                this.display();
                this.sound.playSound();
            }
        }
    }
    reset_sw(){
        if(this.power){
            this.running=false;
            this.error=false;
            this.register=new Int16Array(REGISTER_LENGTH);
            this.flag=new Array(FLAG_LENGTH);
            for(let i=0;i<FLAG_LENGTH;i++){
                this.flag[i]=false;
            }
            this.addressToDisp=0x00;
            this.sound.stopBuzzer();
            this.display();
            this.sound.playSound();
        }
    }
    display(){
        this.displayAddress();
        this.displayData();
        this.displayFlag();
        this.gui.setRunLamp(this.running);
    }
    displayAddress(){
        if(this.rotary===MM){
            for(let i=0;i<BYTE;i++){
                this.gui.setAddressLamp(i,((this.addressToDisp>>>i)&1)===1);
            }
        }else{
            for(let i=0;i<BYTE;i++){
                this.gui.setAddressLamp(i,false);
            }
        }
    }
    displayData(){
        if(this.rotary===MM){
            for(let i=0;i<BYTE;i++){
                this.gui.setDataLamp(i,((this.main_memory[this.addressToDisp]>>>i)&1)===1);
            }
        }else{
            for(let i=0;i<BYTE;i++){
                this.gui.setDataLamp(i,((this.register[this.rotary]>>>i)&1)===1);
            }
        }
    }
    displayFlag(){
        for(let i=0;i<FLAG_LENGTH;i++){
            this.gui.setFlagLamp(i,this.flag[i]);
        }
    }
    run_sw(){
        if(this.power&&(!this.running)){
            this.running=true;
            this.sound.playSound();
            this.runCode();
        }
    }
    stop_sw(){
        if(this.power&&this.running){
            this.running=false;
        }
    }
    runCode(){
        if(this.running){
            this.task1_readCode_(this.main_memory[this.readPC()]);
        }else{
            this.display();
            if(!this.power){
                this.off();
            }
        }
    }
    task1_readCode_(code){
        if(this.gui.isSteppingMode()){
            this.halt();
        }else if(this.gui.isBPMode()){
            if(this.gui.getData()<register[PC]){
                this.halt();
            }
        }
        this.display();
        let op=(code&0b1111_0000)>>>4;
        let gr=(code&0b0000_1100)>>>2;
        let xr=code&0b0000_0011;
        const NEXT=()=>{
            this.task2_runCode_(op,gr,xr);
        }
        setTimeout(NEXT,0);
    }
    task2_runCode_(op,gr,xr){
        try{
            switch(op){
                case 0x0:{
                    break;
                }
                case 0x1:{
                    switch(xr){
                        case 0:{
                            this.load(gr,this.main_memory[this.readPC()]);
                            break;
                        }
                        case 1:{
                            this.load(gr,this.scale(this.main_memory[this.readPC()]+this.register[G1]));
                            break;
                        }
                        case 2:{
                            this.load(gr,this.scale(this.main_memory[this.readPC()]+this.register[G2]));
                            break;
                        }
                        case 3:{
                            this.load(gr,this.readPC());
                            break;
                        }
                    }
                    break;
                }
                case 0x2:{
                    switch(xr){
                        case 0:{
                            this.store(gr,this.main_memory[this.readPC()]);
                            break;
                        }
                        case 1:{
                            this.store(gr,this.scale(this.main_memory[this.readPC()]+this.register[G1]));
                            break;
                        }
                        case 2:{
                            this.soter(gr,this.scale(this.main_memory[this.readPC()]+this.register[G2]));
                            break;
                        }
                        default:throw new Error();
                    }
                    break;
                }
                case 0x3:{
                    switch(xr){
                        case 0:{
                            this.add(gr,this.main_memory[this.readPC()]);
                            break;
                        }
                        case 1:{
                            this.add(gr,scale(this.main_memory[this.readPC()]+this.register[G1]));
                            break;
                        }
                        case 2:{
                            this.add(gr,scale(this.main_memory[this.readPC()]+this.register[G2]));
                            break;
                        }
                        case 3:{
                            this.add(gr,this.readPC());
                        }
                    }
                    break;
                }
                case 0x4:{
                    switch(xr){
                        case 0:{
                            this.sub(gr,this.main_memory[this.readPC()]);
                            break;
                        }
                        case 1:{
                            this.sub(gr,this.scale(this.main_memory[this.readPC()]+this.register[G1]));
                            break;
                        }
                        case 2:{
                            this.sub(gr,this.scale(this.main_memory[this.readPC()]+this.register[G2]));
                            break;
                        }
                        case 3:{
                            this.sub(gr,this.readPC());
                        }
                    }
                    break;
                }
                case 0x5:{
                    switch(xr){
                        case 0:{
                            this.cmp(gr,this.main_memory[this.readPC()]);
                            break;
                        }
                        case 1:{
                            this.cmp(gr,this.scale(this.main_memory[this.readPC]+this.register[G1]));
                            break;
                        }
                        case 2:{
                            this.cmp(gr,this.scale(this.main_memory[this.readPC]+this.register[G2]));
                            break;
                        }
                        case 3:{
                            this.cmp(gr,this.readPC());
                            break;
                        }
                    }
                    break;
                }
                case 0x6:{
                    switch(xr){
                        case 0:{
                            this.and(gr,this.main_memory[this.readPC()]);
                            break;
                        }
                        case 1:{
                            this.and(gr,this.scale(this.main_memory[this.readPC()]+this.register[G1]));
                            break;
                        }
                        case 2:{
                            this.and(gr,this.scale(this.main_memory[this.readPC()]+this.register[G2]));
                            break;
                        }
                        case 3:{
                            this.and(gr,this.readPC());
                            break;
                        }
                    }
                    break;
                }
                case 0x7:{
                    switch(xr){
                        case 0:{
                            this.or(gr,this.main_memory[this.readPC()]);
                            break;
                        }
                        case 1:{
                            this.or(gr,this.scale(this.main_memory[this.readPC()]+this.register[G1]));
                            break;
                        }
                        case 2:{
                            this.or(gr,this.scale(this.main_memory[this.readPC()]+this.register[G2]));
                            break;
                        }
                        case 3:{
                            this.or(gr,this.readPC());
                            break;
                        }
                    }
                    break;
                }
                case 0x8:{
                    switch(xr){
                        case 0:{
                            this.xor(gr,this.main_memory[this.readPC()]);
                            break;
                        }
                        case 1:{
                            this.xor(gr,this.scale(this.main_memory[this.readPC()]+this.register[G1]));
                            break;
                        }
                        case 2:{
                            this.xor(gr,this.scale(this.main_memory[this.readPC()]+this.register[G2]));
                            break;
                        }
                        case 3:{
                            this.xor(gr,this.readPC());
                            break;
                        }
                    }
                    break;
                }
                case 0x9:{
                    switch(xr){
                        case 0:{
                            this.shla(gr);
                            break;
                        }
                        case 1:{
                            this.shll(gr);
                            break;
                        }
                        case 2:{
                            this.shra(gr);
                            break;
                        }
                        case 3:{
                            this.shrl(gr);
                            break;
                        }
                    }
                    break;
                }
                case 0xA:{
                    switch(gr){
                        case 0:{
                            switch(xr){
                                case 0:{
                                    this.jmp(this.main_memory[this.readPC()]);
                                    break;
                                }
                                case 1:{
                                    this.jmp(this.scale(this.main_memory[this.readPC()]+this.register[G1]));
                                    break;
                                }
                                case 2:{
                                    this.jmp(this.scale(this.main_memory[this.readPC()]+this.register[G2]));
                                    break;
                                }
                                default:throw new Error();
                            }
                            break;
                        }
                        case 1:{
                            switch(xr){
                                case 0:{
                                    this.jz(this.main_memory[this.readPC()]);
                                    break;
                                }
                                case 1:{
                                    this.jz(this.scale(this.main_memory[this.readPC()]+this.register[G1]));
                                    break;
                                }
                                case 2:{
                                    this.jz(this.scale(this.main_memory[this.readPC()]+this.register[G2]));
                                    break;
                                }
                                default:throw new Error();
                            }
                            break;
                        }
                        case 2:{
                            switch(xr){
                                case 0:{
                                    this.jc(this.main_memory[this.readPC()]);
                                    break;
                                }
                                case 1:{
                                    this.jc(this.scale(this.main_memory[this.readPC()]+this.register[G1]));
                                    break;
                                }
                                case 2:{
                                    this.jc(this.scale(this.main_memory[this.readPC()]+this.register[G2]));b
                                    break;
                                }
                                default:throw new Error();
                            }
                            break;
                        }
                        case 3:{
                            switch(xr){
                                case 0:{
                                    this.jm(this.main_memory[this.readPC()]);
                                    break;
                                }
                                case 1:{
                                    this.jm(this.scale(this.main_memory[this.readPC()]+this.register[G1]));
                                    break;
                                }
                                case 2:{
                                    this.jm(this.scale(this.main_memory[this.readPC()]+this.register[G2]));
                                    break;
                                }
                                default:throw new Error();
                            }
                            break;
                        }
                    }
                    return;
                }
                case 0xB:{
                    switch(gr){
                        case 0:{
                            switch(xr){
                                case 0:{
                                    this.call(this.main_memory[this.readPC()]);
                                    break;
                                }
                                case 1:{
                                    this.call(this.scale(this.main_memory[this.readPC()]+this.register[G1]));
                                    break;
                                }
                                case 2:{
                                    this.call(this.scale(this.main_memory[this.readPC()]+this.register[G2]));
                                    break;
                                }
                                default:throw new Error();
                            }
                            break;
                        }
                        case 1:{
                            switch(xr){
                                case 0:{
                                    this.jnz(this.main_memory[this.readPC()]);
                                    break;
                                }
                                case 1:{
                                    this.jnz(this.scale(this.main_memory[this.readPC()]+this.register[G1]));
                                    break;
                                }
                                case 2:{
                                    this.jnz(this.scale(this.main_memory[this.readPC()]+this.register[G2]));
                                    break;
                                }
                                default:throw new Error();
                            }
                            break;
                        }
                        case 2:{
                            switch(xr){
                                case 0:{
                                    this.jnc(this.main_memory[this.readPC()]);
                                    break;
                                }
                                case 1:{
                                    this.jnc(this.scale(this.main_memory[this.readPC()]+this.register[G1]));
                                    break;
                                }
                                case 2:{
                                    this.jnc(this.scale(this.main_memory[this.readPC()]+this.register[G2]));b
                                    break;
                                }
                                default:throw new Error();
                            }
                            break;
                        }
                        case 3:{
                            switch(xr){
                                case 0:{
                                    this.jnm(this.main_memory[this.readPC()]);
                                    break;
                                }
                                case 1:{
                                    this.jnm(this.scale(this.main_memory[this.readPC()]+this.register[G1]));
                                    break;
                                }
                                case 2:{
                                    this.jnm(this.scale(this.main_memory[this.readPC()]+this.register[G2]));
                                    break;
                                }
                                default:throw new Error();
                            }
                            break;
                        }
                    }
                    return;
                }
                case 0xC:{
                    switch(xr){
                        case 0:{
                            this.in(gr,this.main_memory[this.readPC()]);
                            break;
                        }
                        case 3:{
                            this.out(gr,this.main_memory[this.readPC()]);
                            break;
                        }
                        default:throw new Error();
                    }
                    break;
                }
                case 0xD:{
                    switch(xr){
                        case 0:{
                            this.push(gr);
                            break;
                        }
                        case 1:{
                            if(gr===3){
                                this.popf();
                                break;
                            }else{
                                throw new Error();
                            }
                        }
                        case 2:{
                            this.pop(gr);
                            break;
                        }
                        case 3:{
                            if(gr===3){
                                this.popf();
                                break;
                            }else{
                                throw new Error();
                            }
                        }
                    }
                    break;
                }
                case 0xE:{
                    if(gr===0){
                        if(xr===0){
                            this.ei();
                            break;
                        }else if(xr===3){
                            this.di();
                            break;
                        }else{
                            throw new Error();
                        }
                    }else if(gr===3){
                        if(xr===0){
                            this.ret();
                            break;
                        }else if(xr===3){
                            this.reti();
                            break;
                        }else{
                            throw new Error();
                        }
                    }else{
                        throw new Error();
                    }
                }
                case 0xF:{
                    if(gr===3&&xr===3){
                        this.halt();
                        break;
                    }else{
                        throw new Error();
                    }
                }
            }
        }catch(error){
            this.halt();
            this.error=true;
            this.runError();
        }
        this.task3_loop_();
    }
    task3_loop_(){
        this.display();
        const LOOP=()=>{
            this.runCode();
        }
        setTimeout(LOOP,0);
    }
    runError(){
        if(this.error){
            this.task1_onRunLamp_();
        }else{
            this.display();
            if(!this.power){
                this.off();
            }
        }
    }
    task1_onRunLamp_(){
        this.gui.setRunLamp(true);
        const NEXT=()=>{
            this.task2_onRunLamp_();
        }
        setTimeout(NEXT,200);
    }
    task2_onRunLamp_(){
        this.gui.setRunLamp(false);
        const LOOP=()=>{
            this.runError();
        }
        setTimeout(LOOP,200);
    }

    load(register,address){
        this.register[register]=this.main_memory[address];
    }
    store(register,address){
        this.write(address,this.register[register]);
    }
    add(register,address){
        let ans=this.register[register]+this.main_memory[address];
        ans=this.changeFlag(ans);
        this.register[register]=ans;
    }
    sub(register,address){
        let ans=this.register[register]-this.main_memory[address];
        ans=this.changeFlag(ans);
        this.register[register]=ans;
    }
    cmp(register,address){
        let ans=this.register[register]-this.main_memory[address];
        this.changeFlag(ans);
    }
    and(register,address){
        let ans=this.register[register]&this.main_memory[address];
        ans=this.changeFlag(ans);
        this.register[register]=ans;
    }
    or(register,address){
        let ans=this.register[register]|this.main_memory[address];
        ans=this.changeFlag(ans);
        this.register[register]=ans;
    }
    xor(register,address){
        let ans=this.register[register]^this.main_memory[address];
        ans=this.changeFlag(ans);
        this.register[register]=ans;
    }
    shla(register){
        let ans=this.register[register]<<1;
        ans=this.changeFlag(ans);
        this.register[register]=ans;
    }
    shll(register){
        this.shla(register);
    }
    shra(register){
        let tmp=new Array(BYTE);
        for(let i=0;i<BYTE;i++){
            tmp[i]=((this.register[register]>>>i)&1)===1;
        }
        for(let i=0;i<BYTE-1;i++){
            tmp[i]=tmp[i+1];
        }
        let ans=0;
        for(let i=0;i<BYTE;i++){
            ans+=(tmp[i]===1?1:0)
        }
        ans=this.changeFlag(ans);
        this.register[register]=ans;
    }
    shrl(register){
        let ans=this.register[register]>>>i;
        ans=this.changeFlag(ans);
        this.register[register]=ans;
    }
    jmp(address){
        this.display();
        this.register[PC]=address;
        const JMP_LOOP=()=>{
            this.task3_loop_();
        }
        setTimeout(JMP_LOOP,0);
    }
    jz(address){
        if(this.flag[Z]){
            this.jmp(address);
        }else{
            this.task3_loop_();
        }
    }
    jc(address){
        if(this.flag[C]){
            this.jmp(address);
        }else{
            this.task3_loop_();
        }
    }
    jm(address){
        if(this.flag[S]){
            this.jmp(address);
        }else{
            this.task3_loop_();
        }
    }
    call(address){
        this.push(PC);
        this.jmp(address);
    }
    jnz(address){
        if(!this.flag[Z]){
            this.jmp(address);
        }else{
            this.task3_loop_();
        }
    }
    jnc(address){
        if(!this.flag[C]){
            this.jmp(address);
        }else{
            this.task3_loop_();
        }
    }
    jnm(address){
        if(!this.flag[S]){
            this.jmp(address);
        }else{
            this.task3_loop_();
        }
    }
    in(register,io_address){
        let ans;
        switch(io_address){
            case 0x0:case 0x1:{
                ans=this.gui.getData();
                break;
            }
            default:{
                throw new Error();
            }
        }
        this.register[register]=ans;
    }
    out(register,io_address){
        let code=this.register[register];
        switch(io_address){
            case 0x0:{
                if((code&0x01)==1){
                    this.sound.playBuzzer();
                }else{
                    this.sound.stopBuzzer();
                }
                break;
            }
            default:{
                throw new Error();
            }
        }
    }
    push(register){
        this.write(--this.register[SP],this.register[register]);
    }
    pushf(){
        this.write(--this.register[SP],(this.interruptable?0x80:0)+(this.flag[C]?0x04:0)+(this.flag[S]?0x02:0)+(this.flag[Z]?0x01:0));
    }
    pop(register){
        this.register[register]=this.main_memory[this.register[SP]++];
    }
    popf(){
        let flags=this.main_memory[this.register[SP]++];
        this.interruptable=(flags>>>7)===1;
        this.flag[C]=(flags>>>2&1)===1;
        this.flag[S]=(flags>>>1&1)===1;
        this.flag[Z]=(flags&1)===1;
    }
    ei(){
        this.interruptable=true;
    }
    di(){
        this.interruptable=false;
    }
    ret(){
        this.pop(PC);
    }
    reti(){
        this.interruptable=true;
        this.ret();
    }
    halt(){
        this.running=false;
    }

    readPC(){
        let ans=this.register[PC]++;
        if(this.register[PC]>0xff){
            this.register[PC]=0x00;
        }
        return ans;
    }
    write(address,data){
        if(this.isRAM(address)){
            this.main_memory[address]=data;
        }
    }
    isRAM(address){
        return address<0xE0;
    }
    changeFlag(ans){
        this.flag[C]=ans<0x00||ans>0xff;
        ans=this.scale(ans);
        this.flag[S]=ans>0x80;
        this.flag[Z]=ans===0;
        return ans;
    }
    scale(ans){
        if(ans<0){
            ans+=0x100;
        }else if(ans>0xff){
            ans-=0x100;
        }
        return ans;
    }
}

//Sound
class Sound{
    context;
    buzzer;
    playing_sound=false;
    playing_buzzer=false;
    id;
    initializeAudio(){
        this.context=new AudioContext();
    }
    playSound(){
        if(this.context===undefined){
            this.initializeAudio();
        }
        if(this.playing){
            this.sound.stop();
            this.playing=false;
        }
        this.sound=this.context.createOscillator();
        this.sound.type="sine";
        this.sound.frequency.value=4000;
        this.sound.connect(this.context.destination);
        this.sound.start();
        this.playing=true;
        const STOP=()=>{
            this.sound.stop();
            this.playing=false;
        }
        this.id=setTimeout(STOP,100);
    }
    playBuzzer(){
        if(!this.playing_buzzer){
            this.buzzer=this.context.createOscillator();
            this.buzzer.type="sine";
            this.buzzer.frequency.value=4000;
            this.buzzer.connect(this.context.destination);
            this.buzzer.start();
            this.playing_buzzer=true;
        }
    }
    stopBuzzer(){
        if(this.playing_buzzer){
            this.buzzer.stop();
            this.playing_buzzer=false;
        }
    }
}

//GUI
const RED="#FF0000";
const GREEN="#00FF00";
const YELLOW="#FFFF00";
const WHITE="#FFFFFF";
class GUI{
    constructor(){
        const TEC=new Tec(this,new Sound());
        //event handler
        power_sw.onclick=()=>{
            TEC.power_sw();
        }
        reset_sw.onmousedown=()=>{
            TEC.reset_sw();
        }
        run_sw.onmousedown=()=>{
            TEC.run_sw();
        }
        stop_sw.onmousedown=()=>{
            TEC.stop_sw();
        }
        seta_sw.onmousedown=()=>{
            TEC.seta_sw();
        }
        left_sw.onmousedown=()=>{
            TEC.rotary_sw(true)
        }
        right_sw.onmousedown=()=>{
            TEC.rotary_sw(false)
        }
        inca_sw.onmousedown=()=>{
            TEC.i_d_sw(true)
        }
        deca_sw.onmousedown=()=>{
            TEC.i_d_sw(false)
        }
        write_sw.onmousedown=()=>{
            TEC.write_sw()
        }
    }
    setPowerLamp(on){
        power_sw.style.backgroundColor=on?RED:WHITE;
    }
    setRunLamp(on){
        run_lamp.style.backgroundColor=on?RED:WHITE;
    }
    setAddressLamp(i,on){
        a_lamps[i].style.backgroundColor=on?RED:WHITE;
    }
    setDataLamp(i,on){
        d_lamps[i].style.backgroundColor=on?GREEN:WHITE;
    }
    setRotaryLamp(i,on){
        r_lamps[i].style.backgroundColor=on?YELLOW:WHITE;
    }
    setFlagLamp(i,on){
        f_lamps[i].style.backgroundColor=on?YELLOW:WHITE;
    }
    getData(){
        let data=0;
        for(let i=0;i<BYTE;i++){
            if(d_sws[i].checked){
                data+=Math.pow(2,i);
            }
        }
        return data;
    }
    isSteppingMode(){
        return step_sw.checked;
    }
    isBPMode(){
        return breac_sw.checked;
    }
}
new GUI();
