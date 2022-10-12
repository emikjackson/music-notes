<script>
  export let onClick = () => alert("I've been clicked! Give me an 'onClick' prop.");
</script>

<button on:click={onClick}>
  <slot />
</button>

<style>
  button {
		font-family: 'Rubik', sans-serif;
		background-color: #5E36A5;
    border: 0px;
		color: #fff;
		padding: 8px 16px;
    font-size: 1rem;
    font-weight: 500;
    box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.1);
	}
</style>