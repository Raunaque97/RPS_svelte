interface IAgent<GameState> {
  // returns the new states after the move
  getNextState(
    gameState: GameState
  ): Promise<{ newPubState: PubState; newPvtStateHash: PvtStateHash }>;
}

interface IGameLogic<GameState> {
  getInitialState: () => GameState;
  isFinalState: (gameState: GameState) => boolean;
}

enum GameEngineStatus {
  WaitingForResponse,
  WaitingForProofGeneration,
  WaitingForProofVerification,
  NotRunning,
  Running,
  Completed,
}

/////////// User defined stuff ///////////
/**  Define GameState & Move  **/
type PvtStateHash = number;
type PubState = {
  step: number;
  Health: {
    0: number;
    1: number;
  };
  // 0:rock, 1:paper, 2:scissors 3:unfedined
  B_move: 0 | 1 | 2 | 3;
};
type PvtState = {
  move: 0 | 1 | 2 | 3;
};
type GameState = PubState & {
  pvtStateHash: {
    0: PvtStateHash;
    1: PvtStateHash;
  };
};

export { GameEngineStatus };
export type { IAgent, GameState, IGameLogic, PubState, PvtStateHash, PvtState };
