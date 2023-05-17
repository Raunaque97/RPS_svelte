import { GameEngineStatus, type IGameLogic } from "./types";
import { writable, type Writable, type Readable, get } from "svelte/store";
import type { IAgent, GameState } from "./types";

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
      while (!this.gameLogic.isFinalState(state)) {
        console.log("%c current GameSate", "color: brown;", state);
        let currStep = state.step;
        let currAgentId = currStep % 2;
        let currAgent = agents[currAgentId];
        this.status = GameEngineStatus.WaitingForResponse;
        console.log("%c Waiting for response from agent", "color: brown;", {
          currAgent,
        });
        let { newPubState, newPvtStateHash } = await currAgent.getNextState(
          state
        );
        this.status = GameEngineStatus.Running;

        // TODO verify the proof/ state transition

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
      agents[state.step % 2].getNextState(state);
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
