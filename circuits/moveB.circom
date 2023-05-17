pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/mimcsponge.circom";
include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/mux1.circom";
include "../node_modules/circomlib/circuits/gates.circom";
include "./templates/utils.circom";

// B is not using any pvt states so no need of hashing
// B only updates its public states. a zk proof is not necessary
template Main() { 
    // previous pub states
    signal input A_Health_prev;  
    signal input B_Health_prev;
    signal input B_move_prev;
    signal input step_prev;
    //pvt 

    // current state
    signal input A_Health;  
    signal input B_Health;
    signal input B_move; 
    signal input step;

    /////// game logic

    A_Health === A_Health_prev;
    B_Health === B_Health_prev;

    // B_move == 0 || B_move == 1 || B_move == 2
    component contains = Contains3(0,1,2);
    contains.in <== B_move;
    contains.out === 1;

    step === step_prev + 1;
}

component main { public [A_Health_prev, B_Health_prev, B_move_prev, A_Health, B_Health, B_move] } = Main();