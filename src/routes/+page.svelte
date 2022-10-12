<script>
  import Button from '$lib/button.svelte'
	let count = 0;
  let paused = false;

	const togglePaused = () => paused = !paused;
</script>

<svelte:head>
 <title>Music Notes</title>
</svelte:head>

<div class="tile">
  <h1>Music Notes</h1>
  <p>Visit <a href="/about">about</a> page</p>
  <Button onClick={togglePaused}>
    {paused ? 'Play' : 'Pause'}
  </Button>
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
