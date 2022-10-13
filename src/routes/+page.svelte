<script>
  import Button from '$lib/button.svelte'
  import { count, time, elapsed } from '../stores.js'

  let paused = false;

  // alternative to $count:
  // let countValue;
  // const unsubscribe = count.subscribe(value => countValue = value)
  // onDestroy(unsubscribe);

	const togglePaused = () => paused = !paused;
  const decrement = () => count.update(n => n - 1);
  const increment = () => count.update(n => n + 1);
  const reset = () => count.set(0);

</script>

<svelte:head>
 <title>Example Title</title>
</svelte:head>

<div class="tile">
  <h1>Example Title</h1>
  <p>Visit <a href="/about">about</a> page</p>
  <Button on:click={togglePaused}>
    {paused ? 'Play' : 'Pause'}
  </Button>

  <h3>Counter</h3>
  <p>{$count}</p>
  <button on:click={increment}>+</button>
  <button on:click={decrement}>-</button>
  <button on:click={reset}>reset</button>

  <h3>Time</h3>
  <p>The time is {$time}.</p>
  <p>This page has been open for {$elapsed} seconds.</p>
</div>

<style>
  .tile {
    background-color: #FDFCFA;
    width: 90%;
    max-width: 700px;
    padding: 30px;
    margin-top: 20px;
    box-sizing: border-box;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  }
  h1 {
    text-align: center;
  }
</style>
