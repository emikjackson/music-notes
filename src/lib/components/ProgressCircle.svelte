<script>
  /**
   * Circle that takes in a "progress" value between 0 and 1 and shows corresponding a green fill 
   * Orig from https://svelte.dev/repl/f1437286b08d4890b9207180868ee37e?version=3.46.4
   */
	export let progress;

  let background = '';
	
	// Adapt the logic according to the approach
	$: background = `radial-gradient(#008060 60%, transparent 61%),
    conic-gradient(transparent 0deg ${360 * progress}deg, white ${360 * progress}deg 360deg),
    #00cf9b;`;
	
	$: cssVarStyles = `--background:${background}`

</script>

<button on:click class="progress-circle" style="{cssVarStyles}">
  <slot />
</button>

<style>
  .progress-circle {
    background: var(--background);
    border-radius: 50%;
    height: 100px;
    width: 100px;
    transition: all 0.2s ease;
    will-change: transform;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.1);
    border: 2px solid #008060;
    cursor: pointer;
    opacity: 1;
  }
  .progress-circle:hover {
    transition: opacity 0.2s linear;
    opacity: 0.95;
  }
</style>