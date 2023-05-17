<script lang="ts">
  import Peer from "peerjs";
  import Web3 from "web3";
  import { onMount } from "svelte";
  import GamePage from "./GamePage.svelte";
  import Player from "../core/agents/Player";
  import RandomAI from "../core/agents/RandomAI";
  import MatchMakingPage from "./MatchMakingPage.svelte";

  let selectedMenuItem:
    | "playAgainstCPU"
    | "playMultiplayer"
    | "howToPlay"
    | "menu" = "menu";
</script>

{#if selectedMenuItem === "menu"}
  <div class="menu">
    <button on:click={() => (selectedMenuItem = "playAgainstCPU")}>
      Play against CPU
    </button>
    <button on:click={() => (selectedMenuItem = "playMultiplayer")}>
      Play multiplayer
    </button>
    <button on:click={() => (selectedMenuItem = "howToPlay")}>
      How to play
    </button>
  </div>
{:else if selectedMenuItem === "playAgainstCPU"}
  <GamePage
    player={new Player()}
    opponent={new RandomAI()}
    firstMover="player"
    onExit={() => (selectedMenuItem = "menu")}
  />
{:else if selectedMenuItem === "playMultiplayer"}
  <MatchMakingPage onExit={() => (selectedMenuItem = "menu")} />
  <button on:click={() => (selectedMenuItem = "menu")}>Back</button>
{:else if selectedMenuItem === "howToPlay"}
  <p>Here are the game rules:</p>
  <ul>
    <li>Each player places their ships on the board.</li>
    <li>Players take turns shooting at each other's ships.</li>
    <li>The first player to sink all of their opponent's ships wins.</li>
  </ul>
  <button on:click={() => (selectedMenuItem = "menu")}>Back</button>
{/if}

<style>
  .menu {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
</style>
