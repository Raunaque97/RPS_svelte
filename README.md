# Part of Project Migawe 

This repo contains the circom files needed to run the game [Ronin's Gambit](https://www.migawe.xyz/ronins-gambit) **A p2p truly on-chain game**

[Explainer video,](https://www.youtube.com/watch?v=TW-Ap6ubjOw&t=24s) an overview of how the game works


### How to use
1. The circuits are defined inside `/circuits` folder
    - `init.circom` verifies the starting state of a game
    - `moveA.circom` verifies the moves (state transitions) of player 0
    - `moveB.circom` verifies the moves (state transitions) of player 1
    - 
2. There is also a simple UI build using svelte for testing the circuits  
3. run `compile.sh` helper script to compile all circom files and copy the necessary files to the destination location for the frontend to use
    Will need a `.ptau` file and update the correct file path in `compile.sh` for it to work

Perform powersOfTau to produce `*.ptau` files needed for verification key generation. [for more details](https://docs.circom.io/getting-started/proving-circuits/#powers-of-tau)
