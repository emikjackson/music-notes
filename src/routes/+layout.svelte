<!-- At the root level of `/routes`, this layout applies to every page! -->

<script>
	import Header from '$lib/Header.svelte'
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