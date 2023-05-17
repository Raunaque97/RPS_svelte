import type {
  IAgent,
  GameState,
  PvtStateHash,
  PubState,
  PvtState,
} from "../types";

export default class Player implements IAgent<GameState> {
  private onMoveSelected: ((move: 0 | 1 | 2) => void) | undefined;
  private privateState: PvtState;

  constructor() {}

  public async getNextState(
    gameState: GameState
  ): Promise<{ newPubState: PubState; newPvtStateHash: PvtStateHash }> {
    return new Promise((resolve) => {
      this.onMoveSelected = (move: 0 | 1 | 2) => {
        this.onMoveSelected = undefined;

        // extract PubState from gameState
        let pubState = { ...gameState };
        delete pubState.pvtStateHash;
        let agentId = gameState.step % 2;

        if (agentId === 0) {
          // 0's turn
          if (this.privateState) {
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
      };
    });
  }

  public selectMove(move: 0 | 1 | 2): void {
    if (this.onMoveSelected) {
      this.onMoveSelected(move);
    } else {
      console.error("onMoveSelected is undefined !! not agent's turn");
    }
  }
}
function calcStateHash(privateState: PvtState): number {
  // for now xor value with a random number
  // TODO change to pederson/ whatever used in circom
  return privateState.move ^ 69;
}
