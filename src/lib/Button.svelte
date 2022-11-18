<!-- Common button component -->

<script>
  export const margin = '10px 0px';
  export let disabled = false; // will not fire on:click & 50% opacity
  export let wide = false; // 100% width
  export let secondary = false; // inverted colors
  export let style = "";
  export let link = false;
</script>

<button on:click style={`margin:${margin};${style}`} disabled={disabled} class:disabled class:wide class:secondary class:link>
  <slot />
</button>

<style>
  button {
		font-family: 'Rubik', sans-serif;
		background-color: #008060;
    border: 2px solid #008060;
		color: #fff;
		padding: 8px 16px;
    font-size: 1.1rem;
    font-weight: 500;
    box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.1);
    box-sizing: border-box;
    min-width: 100px;
    border-radius: 4px;
    cursor: pointer;
	}
  button:hover {
    background-color: #006e53;
  }
  .disabled {
    opacity: 0.5;
  }
  .wide {
    width: 100%;
  }
  .secondary {
		background-color: #fff;
		color: #008060;
  }
  button.secondary:hover {
    background-color: rgb(247, 247, 247);
  }
  .link {
    background-color: transparent;
    border: none;
    box-shadow: none;
    text-decoration: underline;
    color: #008060;
  }
  .link:hover {
    background-color: transparent;
  }
</style>