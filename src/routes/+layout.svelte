<script>
	/**
	 * At the root level of the routes, this layout defines styling applied to every page
	 */
	import Header from '$lib/components/Header.svelte';
	import IntroModal from '$lib/components/IntroModal.svelte';

	let showIntroModal = false;
</script>

<Header onHelpClick={() => (showIntroModal = true)} />

<!-- Intro modal (instructions, shown by default) -->
{#if showIntroModal}
	<IntroModal onCancel={() => (showIntroModal = false)} />
{/if}

<div class="centered">
	<slot />
</div>

<style>
	:global(:root) {
		--primary: #6d2f10;
	}
	.centered {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
