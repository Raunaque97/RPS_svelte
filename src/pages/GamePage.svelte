<script type="ts">
  import App from "../App.svelte";
  import GameEngine from "../core/GameEngine";
  import GameLogic from "../core/GameLogic";
  import type Player from "../core/agents/Player";
  import type { GameState, IAgent } from "../core/types";

  export let player: Player;
  export let opponent: IAgent<GameState>; // or NetworkAgent, depending on your implementation
  export let firstMover: "player" | "opponent";
  export let onExit: () => void;

  const gameEngine = new GameEngine(new GameLogic());
  let gameState = gameEngine.getGameStateStore();
  let playerMove: 0 | 1 | 2;
  let playerId: number;

  if (firstMover === "player") {
    gameEngine.startGame([player, opponent]);
    playerId = 0;
  } else {
    gameEngine.startGame([opponent, player]);
    playerId = 1;
  }

  // function to handle user input
  function finalizeMove() {
    player.selectMove(playerMove);
  }
</script>

{#if $gameState.Health[playerId] === 0}
  <p>You lost</p>
  <button on:click={onExit}>Exit</button>
{:else if $gameState.Health[(playerId + 1) % 2] === 0}
  <p>You won</p>
  <button on:click={onExit}>Exit</button>
{:else}
  <div>
    <p>Your health: {$gameState.Health[playerId]}</p>
    <p>Opponent health: {$gameState.Health[(playerId + 1) % 2]}</p>
  </div>

  {#if $gameState.step % 2 === playerId}
    <p>Your turn</p>
  {:else}
    <p>Wait for Opponent's turn</p>
  {/if}

  <div style="display: flex; justify-content: space-around;">
    {#if playerMove === 0}
      <p>You selected <b>Rock</b></p>
    {:else if playerMove === 1}
      <p>You selected <b>Paper</b></p>
    {:else if playerMove === 2}
      <p>You selected <b>Scissors</b></p>
    {/if}
  </div>
  <div style="display: flex; justify-content: space-around;">
    <button on:click={() => (playerMove = 0)}>R</button>
    <button on:click={() => (playerMove = 1)}>P</button>
    <button on:click={() => (playerMove = 2)}>S</button>
  </div>
  <button on:click={finalizeMove}>Finalize Move</button>
{/if}

<style>
</style>
