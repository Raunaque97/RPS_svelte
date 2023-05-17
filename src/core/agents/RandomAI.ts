import type {
  IAgent,
  GameState,
  PubState,
  PvtStateHash,
  PvtState,
} from "../types";

export default class RandomAI implements IAgent<GameState> {
  private privateState: PvtState;
  constructor() {}

  public async getNextState(
    gameState: GameState
  ): Promise<{ newPubState: PubState; newPvtStateHash: PvtStateHash }> {
    return new Promise((resolve) => {
      // resolve after 1 second timeout
      setTimeout(() => {
        // extract PubState from gameState
        let pubState = { ...gameState };
        delete pubState.pvtStateHash;
        let agentId = gameState.step % 2;

        let move = Math.floor(Math.random() * 3) as 0 | 1 | 2;
        console.log("%c RandomAI: move selected: " + move, "color: brown;");
        if (agentId) {
          // A's turn
          if (this.privateState) {
            // not first move
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
          // set A's move
          console.log("%c RandomAI: move selected: " + move, "color: red;");
          this.privateState = { move: move };
          resolve({
            newPubState: pubState,
            newPvtStateHash: calcStateHash(this.privateState),
          });
        } else {
          // 1's turn
          pubState.B_move = move;
          resolve({
            newPubState: pubState,
            newPvtStateHash: 0, // 1 don't have private state
          });
        }
      }, 1000);
    });
  }
}

function calcStateHash(privateState: PvtState): number {
  // for now xor value with a random number
  // TODO change to pederson/ whatever used in circom
  return privateState.move ^ 69;
}
