<script>
	/**
	 * Modal that allows user to change note settings
	 */
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { onMount } from 'svelte';

	// Button handlers
	export let onCancel;
	export let pageIndex = 0;
	const handleNext = () => (pageIndex += 1);
</script>

<Modal>
	{#if pageIndex === 0}
		<h2>How to use the Note Sequence Guesser!</h2>
		<div class="content">
			<p>
				Test your ear by listening to a sequence of notes, then choose which notes in the scale you
				heard.
			</p>
		</div>
	{:else if pageIndex === 1}
		<h2>Listen to the sequence</h2>
		<div class="content">
			<p>
				Test your ear by listening to a sequence of notes, then choose which notes in the scale you
				heard.
			</p>
		</div>
	{/if}
	<div class="buttons-row">
		<Button secondary={true} on:click={onCancel}>Close</Button>
		<Button on:click={handleNext}>Next</Button>
	</div>
</Modal>

<style>
	.content {
		margin: 20px 0px;
	}
	.content > label,
	.content > div {
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid #bbb;
		margin-bottom: 20px;
		padding-bottom: 20px;
	}
	.content > label:first-child {
		border-top: 1px solid #bbb;
		padding-top: 20px;
	}
	.notes-slider {
		display: flex;
		align-items: center;
		font-size: 1.1rem;
		font-weight: bold;
		margin-left: 5px;
	}
	.buttons-row {
		display: flex;
		justify-content: flex-end;
		gap: 5px;
	}
	p {
		margin: 0px;
	}
</style>
