# Rock Paper Scissors (2 party private information game)

- `/circuits` contains the circom which encodes the game rules
- `/src` has a crude UI to play the game a more polished game built using this can be found here, 
    [Ronin's Gambit](https://www.migawe.xyz/ronins-gambit) **A p2p truly on-chain game**
- `/src/core` contains the main piece which implements the p2p layers (**zk state channel**)


[Explainer video :](https://www.youtube.com/watch?v=TW-Ap6ubjOw&t=24s) an overview of how the game works

The idea behind the architecture is explained [here](https://hackmd.io/HcmUyAB4S7qbm9zXcTHicA)

The accompanying solidity contracts can be found in my other [repo](https://github.com/Raunaque97/RPS_Game_Contracts)

### How to use
1. The circuits are defined inside `/circuits` folder
    - `init.circom` verifies the starting state of a game
    - `moveA.circom` verifies the moves (state transitions) of player 0
    - `moveB.circom` verifies the moves (state transitions) of player 1
    - 
2. `npm run dev` to runs the UI build using Svelte for testing the circuits.
3. run `compile.sh` helper script to compile all circom files and copy the necessary files to the destination location for the frontend to use
    Will need a `.ptau` file and update the correct file path in `compile.sh` for it to work

Perform powersOfTau to produce `*.ptau` files needed for verification key generation. [for more details](https://docs.circom.io/getting-started/proving-circuits/#powers-of-tau)
