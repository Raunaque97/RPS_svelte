pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/mimcsponge.circom";
include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/gates.circom";
include "./templates/utils.circom";

/*
   A_Health:5,
	B_Health:5,
   B_move: 3, // 0:rock, 1:paper, 2:scissors 3:unfedined
   A:{
      move:0,1,2
   }
*/  

template Main() { 
   signal input A_Health;  
   signal input B_Health;
   signal input B_move; 
   signal input A_move; // private input
   signal input step;
   signal output hash;

   A_Health === 5;
   B_Health === 5;

   B_move === 3; // innitialize to undefined

   // A's move can be 0,1,2. A==0 || A==1 || A==2
   component contains = Contains3(0,1,2);
   contains.in <== A_move;
   contains.out === 1;

   step === 0; // initialize step to 0
   // calculate hash of private states
   component hasher = MiMCSponge(1, 220, 1);
   hasher.k <== 0;
   hasher.ins[0] <== A_move;

   hash <== hasher.outs[0];

}

component main { public [A_Health, B_Health, B_move] } = Main();
