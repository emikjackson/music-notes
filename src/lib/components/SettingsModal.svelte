<script>
	/**
	 * Modal that allows user to change note settings
	 */
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';

	// Button handlers
	export let onSave;
	export let onCancel;

	// Bound state handlers
	export let numNotesToGenerate;
	export let noteType;
	export let key;
	export let syntheticOrGuitar;
	export let progressiveAnswerIndication;
	export let activeSettings;
	let fieldsChanged = false;

	// Check if any fields have changed from the current settings (disable save if not)
	$: fieldsChanged =
		activeSettings.numNotesToGenerate !== numNotesToGenerate ||
		activeSettings.key !== key ||
		activeSettings.noteType !== noteType ||
		activeSettings.syntheticOrGuitar !== syntheticOrGuitar ||
		activeSettings.progressiveAnswerIndication !== progressiveAnswerIndication;
</script>

<Modal>
	<h2>Note settings</h2>
	<div class="content">
		<label>
			Key:
			<select bind:value={key}>
				<option value="G">G</option>
				<option value="D">D</option>
			</select>
		</label>
		<label>
			Number of notes:
			<div class="notes-slider">
				{numNotesToGenerate}
				<input
					type="range"
					ist="tickmarks"
					max={6}
					min={1}
					step={1}
					bind:value={numNotesToGenerate}
					style="margin-left: 10px;"
				/>
			</div>
		</label>
		<div role="radiogroup" aria-labelledby="noteTypeGroupLabel">
			<p id="noteTypeGroupLabel">Note type:</p>
			<div>
				<label>
					<input type="radio" bind:group={noteType} name="noteType" value="eighth" />
					Eighth
				</label>
				<label>
					<input type="radio" bind:group={noteType} name="noteType" value="quarter" />
					Quarter
				</label>
				<label>
					<input type="radio" bind:group={noteType} name="noteType" value="mixed" />
					Mixed
				</label>
			</div>
		</div>
		<label>
			Indicate each answer note's correctness:
			<select bind:value={progressiveAnswerIndication}>
				<option value="non_progressive">No</option>
				<option value="progressive">Yes</option>
			</select>
		</label>
		<!-- <label>
			Synthetic or guitar notes:
			<select bind:value={syntheticOrGuitar}>
				<option value="synthetic">Synthetic</option>
				<option value="guitar">Recorded guitar</option>
			</select>
		</label> -->
	</div>
	<Button disabled={!fieldsChanged} on:click={onSave}>Save</Button>
	<Button secondary={true} on:click={onCancel}>Cancel</Button>
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
	p {
		margin: 0px;
	}
</style>
