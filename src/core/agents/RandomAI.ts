import { snarkjs } from "../snark";
import type {
  IAgent,
  GameState,
  PubState,
  PvtStateHash,
  PvtState,
} from "../types";

export default class RandomAI implements IAgent<GameState> {
  private privateState: PvtState;
  private pvtStateHash: PvtStateHash;

  constructor() {}

  public async getNextState(gameState: GameState): Promise<{
    newPubState: PubState;
    newPvtStateHash: PvtStateHash;
    proof: any;
    publicSignals;
  }> {
    return new Promise((resolve) => {
      // resolve after 1 second timeout
      setTimeout(async () => {
        // extract PubState from gameState
        // extract PubState from gameState & deep copy
        let pubState = { ...gameState };
        delete pubState.pvtStateHash;
        pubState = JSON.parse(JSON.stringify(pubState));

        let agentId = gameState.step % 2;
        // save a deep copy of the previous private state
        // needed for proof generation
        let prevPvtState = this.privateState
          ? JSON.parse(JSON.stringify(this.privateState))
          : undefined;

        //////////////////////////////////////////
        // GAME LOGIC
        let move = Math.floor(Math.random() * 1) as 0 | 1 | 2;
        console.log("%c RandomAI: move selected: " + move, "color: red;");
        if (agentId === 0) {
          // 0's turn
          if (gameState.step > 0) {
            // update healths
            let diff = (3 + this.privateState.move - gameState.B_move) % 3;
            if (diff === 1) {
              // 0 wins
              pubState.Health[1] -= 1;
            } else if (diff === 2) {
              // 1 wins
              pubState.Health[0] -= 1;
            }
          }
          this.privateState = { move: move };
        } else {
          // 1's turn
          pubState.B_move = move;
        }

        //////////////////////////////////////////
        // construct proof of correct transition
        let zkCircuitName, inputs;
        let pvtState = {};
        for (let key in this.privateState) {
          pvtState["P" + agentId + "_" + key] = this.privateState[key];
        }
        if (gameState.step === 0) {
          zkCircuitName = "init";
          inputs = { ...pubState, ...pvtState };
        } else {
          zkCircuitName = agentId === 0 ? "moveA" : "moveB";
          // construct prevStates
          let prevStates = {};
          for (let key in pubState) {
            prevStates[key + "_prev"] = gameState[key];
          }
          for (let key in prevPvtState) {
            prevStates["P" + agentId + "_" + key + "_prev"] = prevPvtState[key];
          }
          // @ts-ignore
          prevStates.step_prev = gameState.step - 1; // Super hacky, as gameEngine is updating the 'step'

          inputs = {
            ...prevStates,
            ...pubState,
            ...pvtState,
            hash_prev: this.pvtStateHash,
          };
        }
        try {
          let time = performance.now();
          let { proof, publicSignals } = await snarkjs.groth16.fullProve(
            inputs,
            zkCircuitName + ".wasm",
            zkCircuitName + ".zkey"
          );
          this.pvtStateHash = publicSignals[0]; // as circuit has only one output
          time = performance.now() - time;
          console.log(
            `%c proofGeneration took ${(time / 1000).toFixed(5)} sec`,
            "color: blue; font-size: 15px;"
          );
          resolve({
            newPubState: pubState,
            newPvtStateHash: agentId === 0 ? this.pvtStateHash : 0,
            proof: proof,
            publicSignals: publicSignals,
          });
        } catch (error) {
          console.warn(
            "%cproof generation failed!!!",
            "color: red; font-size: 20px;",
            error
          );
        }
      }, 1000);
    });
  }
}
