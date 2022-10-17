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
  <p>Back to <a href="/">home</a> page</p>
  <a href="/blog/hello-world">Blog (hello world)</a>
  <a href="/blog/nasdkajsdl">Blog (nasdkajsdl)</a>
  <br/>
  <br/>

  <Button on:click={handleClick}>
    Get post
  </Button>
  
  <div class="post">
    {#await promise}
      <p>...waiting</p>
    {:then post}
      <h4>{post.title}</h4>
      <p>{post.body}</p>
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </div>
</div>


<style>
  h1 {
    text-align: center;
  }
  .post {
    padding: 20px;
    background-color: white;
    border: 1px solid blanchedalmond;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
    width: 600px;
    margin: 10px 0px;
  }
</style>
