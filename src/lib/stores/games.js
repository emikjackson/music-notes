import { derived, writable } from "svelte/store";

const createGames = () => {
  const { update, set, subscribe } = writable([]);
  
  return {
    subscribe,
    // expects newGame to be { won: boolean, notes: array, }
    addGame: (newGame) => update(prevGames => [...prevGames, newGame]),
    resetGames: set([]),
  }
}

export const games = createGames();

// number of won games
export const score = derived(games, $games => $games.filter(game => game.won).length)