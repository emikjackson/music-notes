<script>
	/**
	 * Main page of app with settings & note quiz!
	 */
	import {
		getRandomNotes,
		addPlayProperties,
		getRootNote,
		compareNotesToAnswer,
		playSyntheticNote
	} from '$lib/helpers/notes.js';
	import { GScale, DScale, EIGHTH_NOTE_DURATION_MS } from '$lib/constants/notes.js';
	import { timer } from '../stores.js';
	import Button from '$lib/components/Button.svelte';
	import playIcon from '$lib/assets/play.svg';
	import pauseIcon from '$lib/assets/pause.svg';
	import newArrowsIcon from '$lib/assets/new_arrows.svg';
	import playRootIcon from '$lib/assets/play_root.svg';
	import pauseRootIcon from '$lib/assets/pause_root.svg';
	import ProgressCircle from '$lib/components/ProgressCircle.svelte';
	import SettingsModal from '$lib/components/SettingsModal.svelte';

	// Playing & note generation state
	let activeNoteIdx = 0;
	let numNotesToGenerate = 3;
	let noteType = 'eighth'; // type should be 'quarter', 'eighth', or 'mixed'
	let syntheticOrGuitar = 'guitar';
	let progressiveAnswerIndication = 'non_progressive';
	let key = 'G';
	let scale = GScale;

	let paused = false;
	let durationMs = 1000;
	let progress = 0;
	let rootNotePaused = true;
	let showSettingsModal = false;
	let newNotesAnimDegrees = 0;

	let activeSettings = {
		numNotesToGenerate,
		key,
		noteType,
		syntheticOrGuitar,
		progressiveAnswerIndication
	};

	// Answer state
	let revealAnswer = false;
	const getEmptyArrayOfLengthN = (n) => {
		let arr = [];
		for (let i = 0; i < n; i++) {
			arr.push('');
		}
		return arr;
	};
	let answerArray = getEmptyArrayOfLengthN(numNotesToGenerate);

	// fetch a new batch of notes based on given state (numNotesToGenerate & noteType)
	const getNotes = () => addPlayProperties(getRandomNotes(numNotesToGenerate, noteType, key));

	let notes = getNotes();
	$: paused = notes[activeNoteIdx].paused;
	$: durationMs = notes.reduce((total, note) => {
		if (note.type === 'quarter') {
			total += EIGHTH_NOTE_DURATION_MS * 2; // approximate duration for quarter note
		} else {
			total += EIGHTH_NOTE_DURATION_MS; // approximate duration for eighth note
		}
		return total;
	}, 0);
	$: progress = durationMs === 0 ? 0 : $timer / durationMs || 0;
	$: scale = activeSettings.key === 'G' ? GScale : DScale;

	const handlePlayPause = () => {
		notes[activeNoteIdx].paused = !paused;
		timer.toggle(paused);
	};

	// when a note finishes, update the next note to play (if it exists)
	const handleNoteFinish = (idx) => {
		const nextIndex = idx + 1;
		// if next note exists ...
		if (nextIndex < notes.length) {
			// Mark the next note as active ...
			activeNoteIdx = nextIndex;
			// and unpause it (play it!)
			notes[nextIndex].paused = false;
		} else {
			// otherwise, set the active index back to the start
			activeNoteIdx = 0;
			timer.reset();
		}
	};

	// Reset answers and get new set of notes
	const handleUpdateNotes = () => {
		// close out current progress, then set new notes
		activeNoteIdx = 0;
		revealAnswer = false;
		timer.reset();
		notes = getNotes();
		activeSettings = {
			numNotesToGenerate,
			key,
			noteType,
			syntheticOrGuitar,
			progressiveAnswerIndication
		};
		answerArray = getEmptyArrayOfLengthN(numNotesToGenerate);
	};

	// Handler for "New notes" button with arrows icon. Fetches new arrows & spins icon.
	const handleNewNotesClick = () => {
		// Spin arrows
		const newNotesIcon = document.getElementById('newNotesIcon');
		newNotesAnimDegrees += 360;
		newNotesIcon.style.transform = `rotate(${newNotesAnimDegrees}deg)`;
		// Get new notes
		handleUpdateNotes();
	};

	// Save settings and close settings modal
	const handleSettingsSave = () => {
		handleUpdateNotes();
		showSettingsModal = false;
	};

	// Close settings modal & reset temp values to active settings
	const handleSettingsCancel = () => {
		showSettingsModal = false;
		numNotesToGenerate = activeSettings.numNotesToGenerate;
		noteType = activeSettings.noteType;
		key = activeSettings.key;
		syntheticOrGuitar = activeSettings.syntheticOrGuitar;
		progressiveAnswerIndication = activeSettings.progressiveAnswerIndication;
	};

	// const playSynthNote = (isPaused, note, index) => {
	// 	if (!isPaused && activeSettings.syntheticOrGuitar === 'synthetic') {
	// 		playSyntheticNote(note, () => handleNoteFinish(index));
	// 	}
	// };
	// $: playSynthNote(paused, notes[activeNoteIdx], activeNoteIdx);
</script>

<!-- Notes settings modal (change note type, num notes, etc.) - only shown when "showSettingsModal" is true -->
{#if showSettingsModal}
	<SettingsModal
		bind:numNotesToGenerate
		bind:noteType
		bind:key
		bind:activeSettings
		bind:syntheticOrGuitar
		bind:progressiveAnswerIndication
		onSave={handleSettingsSave}
		onCancel={handleSettingsCancel}
	/>
{/if}

<!-- Display currently active settings & prompt to open settings modal -->
<div class="settings">
	<div>
		Playing <strong>{activeSettings.numNotesToGenerate} {activeSettings.noteType} notes</strong> in
		key of <strong>{activeSettings.key}</strong>.
	</div>
	<Button
		on:click={() => (showSettingsModal = true)}
		link
		style="margin:0px;padding:0px;font-size:1rem;"
	>
		Change note settings.
	</Button>
</div>

<!-- Big play button and root-note button section. Plays audio snippets. -->
<div class="play-progress">
	<div class="lil-circle-wrapper new-notes">
		<button class="lil-circle-button" on:click={handleNewNotesClick}>
			<img id="newNotesIcon" class="smooth" src={newArrowsIcon} alt="" />
		</button>
		New notes
	</div>
	<ProgressCircle {progress} on:click={handlePlayPause}>
		<img src={paused ? playIcon : pauseIcon} alt="" />
		{#if activeSettings.syntheticOrGuitar === 'guitar'}
			{#each notes as note, idx (`${note.name}_audio_${idx}`)}
				<audio
					src={note.src}
					controls={false}
					bind:duration={note.duration}
					bind:paused={note.paused}
					on:ended={() => handleNoteFinish(idx)}
				/>
			{/each}
		{/if}
	</ProgressCircle>
	<div class="lil-circle-wrapper">
		<button class="lil-circle-button" on:click={() => (rootNotePaused = !rootNotePaused)}>
			<div class="root-note-text">{activeSettings.key}<span>1</span></div>
			<img src={rootNotePaused ? playRootIcon : pauseRootIcon} alt="" />
		</button>
		Hear root
		<audio
			controls={false}
			src={getRootNote(activeSettings.key).src}
			bind:paused={rootNotePaused}
		/>
	</div>
</div>

<!-- Answer submit section (selectable column for each note) & answer display -->
<div class="answer-wrapper">
	<!-- Note select columns -->
	<div class="answer-notes">
		{#each notes as note, idx (`${note.name}_input_${idx}`)}
			<div>
				<h3>Note {idx + 1}</h3>
				<ul class="note-column">
					{#each scale as scaleNote, scaleNoteIdx (`${scaleNote}_${idx}_${scaleNoteIdx}`)}
						{@const id = `note-${idx}-${scaleNoteIdx}`}
						{@const value = scaleNoteIdx + 1}

						<li>
							<input type="radio" bind:group={answerArray[idx]} {id} name={`note-${idx}`} {value} />
							<label for={id} class:progressive={progressiveAnswerIndication === 'progressive'}
								>{scaleNote} <span style="color:#aaa;margin-left: 6px;">{value}</span>
								<!-- Show whether or not currently selected not is correct if user has selected 'progressiveAnswerIndication' -->
								{#if progressiveAnswerIndication === 'progressive' && answerArray[idx] === scaleNoteIdx + 1}
									{#if answerArray[idx] === notes[idx].num}
										<span class="green">✓</span>
									{:else}
										<span class="red">✗</span>
									{/if}
								{/if}</label
							>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
	<!-- Correct/incorrect answer displays -->
	{#if answerArray.every((answer) => answer !== '')}
		{#if compareNotesToAnswer(notes, answerArray)}
			<p class="correct-msg">Huzzah!!! You got it right!</p>
			<Button on:click={handleUpdateNotes}>Get new notes</Button>
		{:else if !revealAnswer}
			<p class="incorrect-msg">Hmmm... not quite right...</p>
			<Button link on:click={() => (revealAnswer = !revealAnswer)}>
				I give up! Show me the answer.
			</Button>
		{:else}
			<p style="margin-bottom: 0px;">The correct answer was ...</p>
			<p class="notes-answer">
				{notes.map((note) => `${note.value} ${note.num}`).join(', ')}
			</p>
			<Button on:click={handleUpdateNotes}>Get new notes</Button>
		{/if}
	{/if}
</div>

<style>
	.correct-msg,
	.incorrect-msg,
	.notes-answer {
		padding: 15px 20px;
		border-radius: 6px;
		background-color: #ffc6c6;
		box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
		margin-bottom: 0px;
	}
	.correct-msg {
		background-color: #cff0d6;
	}
	.notes-answer {
		background-color: #cfebf0;
		margin-top: 5px;
	}
	.settings {
		background-color: #e6efea;
		border-radius: 0px 0px 8px 8px;
		padding: 15px 20px;
		box-sizing: border-box;
		box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.06);
		margin-bottom: 30px;
		width: 100%;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
	}
	.settings > div {
		text-align: center;
		margin-right: 5px;
	}

	@media (max-width: 800px) {
		.settings {
			padding: 10px 0px;
			margin-bottom: 15px;
		}
	}
	.play-progress {
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}
	.play-progress img {
		width: 40px;
		height: 60px;
	}

	/* Base styling for the small circles next to the play button ("root" + "new notes" buttons) */

	.lil-circle-wrapper {
		width: 65px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		color: grey;
		font-style: italic;
		margin: 0px 10px;
		font-size: 0.8rem;
	}
	.lil-circle-button {
		background-color: #accfe9;
		border-radius: 50%;
		height: 50px;
		width: 50px;
		border: 2px solid #456b87;
		color: #456b87;
		font-weight: 600;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 1rem;
		box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
		cursor: pointer;
		opacity: 1;
	}
	.lil-circle-button:hover {
		opacity: 0.9;
		transition: opacity 0.2s linear;
	}
	.lil-circle-wrapper img {
		width: 12px;
		height: 15px;
	}

	/* Adjust lil-circle classes for "new notes" custom styling (green + larger image) */

	.lil-circle-wrapper.new-notes {
		margin-left: 8px;
	}
	.lil-circle-wrapper.new-notes img {
		width: 30px;
		height: 30px;
	}
	.lil-circle-wrapper.new-notes .lil-circle-button {
		background-color: #cfe7da;
		border: 2px solid #157a61;
	}
	.smooth {
		-webkit-transition: transform 1.5s ease;
		-moz-transition: transform 1.5s ease;
		-o-transition: transform 1.5s ease;
		-ms-transition: transform 1.5s ease;
		transition: transform 1.5s ease;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.root-note-text {
		font-size: 1rem;
	}

	.root-note-text span {
		opacity: 0.7;
		margin-left: 2px;
	}

	/* Answer section styling */

	.answer-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 60px;
	}

	.answer-notes {
		display: flex;
		flex-wrap: wrap;
		max-width: 100%;
		justify-content: center;
	}

	.answer-notes h3 {
		font-size: 1rem;
		margin: 20px 0px 10px 0px;
		text-align: center;
	}

	.note-column {
		list-style-type: none;
		padding: 0px;
		display: flex;
		flex-direction: column-reverse;
		border-radius: 8px;
		box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.08);
		margin: 0px 10px;
	}

	.note-column li {
		width: 80px;
		height: 30px;
		position: relative;
	}

	.note-column label,
	.note-column input {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.note-column input[type='radio'] {
		opacity: 0.01;
		z-index: 2;
	}

	.note-column input[type='radio']:checked + label {
		background-color: #cff0d6;
	}

	.note-column input[type='radio']:checked + label.progressive {
		background-color: #e7e7e7;
	}

	.note-column label {
		padding: 5px;
		border: 1px solid #ccc;
		border-bottom: 0px solid #ccc;
		z-index: 1;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		background-color: white;
	}

	.note-column li:last-child label {
		border-radius: 8px 8px 0px 0px;
	}

	.note-column li:first-child label {
		border-radius: 0px 0px 8px 8px;
		border-bottom: 1px solid #ccc;
	}

	.note-column label:hover,
	.note-column li:hover label {
		background-color: #ddd;
		cursor: pointer;
	}

	.note-column input {
		cursor: pointer;
	}

	.red {
		color: #dd1b1b;
		position: absolute;
		top: 4px;
		right: 6px;
	}

	.green {
		color: #689f0f;
		position: absolute;
		top: 4px;
		right: 4px;
	}
</style>
