<script>
	/**
	 * At the root level of the routes, this layout defines styling applied to every page
	*/
	import Header from '$lib/components/Header.svelte'
</script>

<Header />

<div class="centered">
  <slot></slot>
</div>

<style>
	:global(:root){
		--primary: #6d2f10;
	}
	.centered {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>