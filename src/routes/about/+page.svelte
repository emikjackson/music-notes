<script>
  import Button from '$lib/Button.svelte'
	async function getFirstPost() {
		// const res = await fetch(`/tutorial/random-number`);
		// const text = await res.text();
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/1`);
    const post = await res.json();

		if (res.ok) {
			return post;
		} else {
			throw new Error(post);
		}
	}

	let promise = getFirstPost();

	function handleClick() {
		promise = getFirstPost();
	}
</script>

<svelte:head>
 <title>Music Notes: About</title>
</svelte:head>

<div class="tile">
  <h1>About</h1>
  <p>Site made for my pops, Alan Jackson, to perhaps help train his ear.</p>
  <p>The beautiful tones you hear come straight from Alan's guitar.</p>
  <p>Created by Emi Jackson in Svelte.</p>
</div>


<style>
  h1 {
    text-align: center;
  }
  .tile {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
