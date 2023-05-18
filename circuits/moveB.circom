pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/mimcsponge.circom";
include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/mux1.circom";
include "../node_modules/circomlib/circuits/gates.circom";
include "./templates/utils.circom";

// B is not using any pvt states so no need of hashing
// B only updates its public states. a zk proof is not necessary
template Main() { 
    signal input hash_prev;  
    // previous pub states
    signal input Health_prev[2];  
    signal input B_move_prev;
    signal input step_prev;

    // current state
    signal input Health[2];  
    signal input B_move;
    signal input step;
    //pvt 
    signal output hash;
 
    /////// game logic

    Health[0] === Health_prev[0];
    Health[1] === Health_prev[1];

    // B_move == 0 || B_move == 1 || B_move == 2
    component contains = Contains3(0,1,2);
    contains.in <== B_move;
    contains.out === 1;

    step === step_prev + 1;
    hash <== hash_prev; // B does not need pvt states
}

component main { public [hash_prev, Health_prev, B_move_prev, step_prev, Health, B_move, step] } = Main();