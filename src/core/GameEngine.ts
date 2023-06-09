import { GameEngineStatus, type IGameLogic } from "./types";
import { writable, type Writable, type Readable, get } from "svelte/store";
import type { IAgent, GameState } from "./types";
import * as init_vk from "../assets/init_vk.json";
import * as moveA_vk from "../assets/moveA_vk.json";
import * as moveB_vk from "../assets/moveB_vk.json";
import { snarkjs } from "./snark";

class GameEngine {
  private status: GameEngineStatus;
  private gameLogic: IGameLogic<GameState>;
  private gameState: Writable<GameState>;

  constructor(gameLogic: IGameLogic<GameState>) {
    this.gameLogic = gameLogic;
    this.status = GameEngineStatus.NotRunning;
    this.gameState = writable(undefined);
  }
  /**
   * @param agents An array of agents. the first agent starts the game.
   */
  public async startGame(agents: IAgent<GameState>[]) {
    this.gameState.set(this.gameLogic.getInitialState());
    try {
      //////////////// Game loop
      let state = get(this.gameState);
      let proof, publicSignals;
      while (!this.gameLogic.isFinalState(state)) {
        // console.log("%c current GameSate", "color: brown;", state);
        const currStep = state.step;
        const currAgentId = currStep % 2;
        const currAgent = agents[currAgentId];
        /*************************************************/
        this.status = GameEngineStatus.WaitingForResponse;
        console.log("%c Waiting for response from agent", "color: brown;", {
          currAgent,
        });
        let newPubState, newPvtStateHash;
        ({ newPubState, newPvtStateHash, proof, publicSignals } =
          await currAgent.getNextState(state, proof, publicSignals));
        this.status = GameEngineStatus.Running;

        /*************************************************/
        this.status = GameEngineStatus.WaitingForProofVerification;
        // TODO verify the proof/ state transition
        let verification_key;
        if (currStep === 0) {
          verification_key = init_vk;
        } else {
          verification_key = currAgentId === 0 ? moveA_vk : moveB_vk;
        }
        let time = performance.now();
        const verified = await snarkjs.groth16.verify(
          verification_key,
          publicSignals,
          proof
        );
        this.status = GameEngineStatus.Running;
        if (!verified) {
          console.error("Proof verification failed");
          // TODO report agent
          break; // end game
        }
        time = performance.now() - time;
        console.log(
          `%c proof Verification took ${(time / 1000).toFixed(5)} sec`,
          "color: green; font-size: 12px;"
        );

        /*************************************************/
        // calc new GameState
        state = {
          ...newPubState,
          pvtStateHash: state.pvtStateHash,
        };
        state.pvtStateHash[currAgentId] = newPvtStateHash;
        state.step = currStep + 1;
        this.gameState.set(state);
      }
      // so that the other agent can get the final state/ final move
      // *Only works for 2 agents
      agents[state.step % 2].getNextState(state, proof, publicSignals);
    } catch (error) {
      this.status = GameEngineStatus.NotRunning;
      console.error(error);
    }
    this.status = GameEngineStatus.Completed;
  }

  public getGameStateStore(): Readable<GameState> {
    return this.gameState;
  }

  public getStatus(): GameEngineStatus {
    return this.status;
  }
}

export default GameEngine;
