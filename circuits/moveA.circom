pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/mimcsponge.circom";
include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/mux1.circom";
include "../node_modules/circomlib/circuits/gates.circom";
include "./templates/utils.circom";

// we want to proove that the hash of the state is equal to the hash previous hash and
//  the next state is valid and
//  output the next state hash
template Main() { 
    signal input hash_prev;  
    // previous pub states
    signal input Health_prev[2];  
    signal input B_move_prev;
    signal input step_prev;
    //pvt 
    signal input P0_move_prev;

    // current state
    signal input Health[2];  
    signal input B_move;
    signal input step;
    //pvt 
    signal input P0_move;
    signal output hash;


    // hash of private states should be equal to hash_prev
    component hasher = MiMCSponge(1, 220, 1);
    hasher.k <== 0;
    hasher.ins[0] <== P0_move_prev;
    hash_prev === hasher.outs[0];

    /////// game logic
    // rock: 0, paper: 1, scissors: 2
    // 0 beats 2, 1 beats 0, 2 beats 1
    signal diff <== 3 + P0_move_prev - B_move_prev;
    /**
        draw if diff === 3
        A wins if diff === 1 or 4
        B wins if diff === 2 or 5
    */

    // if diff === 1 || diff === 4
    //     health[1] = health[1] - 1
    component contains1 = Contains2(1,4);
    contains1.in <== diff;

    // if A wins, B loses 1 health
    component mux1 = Mux1();
    mux1.c[0] <== Health_prev[1];
    mux1.c[1] <== Health_prev[1] - 1;
    mux1.s <== contains1.out;
    Health[1] === mux1.out;

    // if diff === 2 || diff === 5
    //     health[0] = health[0] - 1
    component contains2 = Contains2(2,5);
    contains2.in <== diff;
    // if B wins, A loses 1 health
    component mux2 = Mux1();
    mux2.c[0] <== Health_prev[0];
    mux2.c[1] <== Health_prev[0] - 1;
    mux2.s <== contains2.out;
    Health[0] === mux2.out;

    B_move === B_move_prev;

    // P0_move == 0 || P0_move == 1 || P0_move == 2
    component contains3 = Contains3(0,1,2);
    contains3.in <== P0_move;
    contains3.out === 1;

    step === step_prev + 1;
    // calculate next hash
    component hasher1 = MiMCSponge(1, 220, 1);
    hasher1.k <== 0;
    hasher1.ins[0] <== P0_move;

    hash <== hasher1.outs[0];
}

component main { public [hash_prev, Health_prev, B_move_prev, step_prev, Health, B_move, step] } = Main();