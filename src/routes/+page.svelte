<script>
  import { getRandomNotes, addPlayProperties, getRootNote, compareNotesToAnswer } from '$lib/helpers/notes.js'
  import { GScale } from '$lib/constants/notes.js'
  import { timer } from '../stores.js';
  // import Button from '$lib/Button.svelte';
  import playIcon from '$lib/assets/play.svg';
  import pauseIcon from '$lib/assets/pause.svg';
  import playIconGrey from '$lib/assets/play_grey.svg';
  import pauseIconGrey from '$lib/assets/pause_grey.svg';
	import ProgressCircle from '$lib/ProgressCircle.svelte';

  // Playing & note generation state
  let activeNoteIdx = 0;
  let numNotesToGenerate = 3;
  let noteType = 'eighth' // type should be 'quarter', 'eighth', or 'mixed'
  let paused = false;
  let durationMs = 1000;
  let progress = 0;
  let key = 'G';
  let fieldsChanged = false;
  let rootNotePaused = true;
  let activeSettings = {
    numNotesToGenerate,
    key,
    noteType
  };

  // Answer state
  let revealAnswer = false;
  const getEmptyArrayOfLengthN = (n) => {
    let arr = [];
    for (let i = 0; i < n; i++) {
      arr.push('');
    }
    return arr;
  }
  let answerArray = getEmptyArrayOfLengthN(numNotesToGenerate);

  // fetch a new batch of notes based on given state (numNotesToGenerate & noteType)
  const getNotes = () => addPlayProperties(getRandomNotes(numNotesToGenerate, noteType))
  // timer.reset();

  let notes = getNotes();
  $: paused = notes[activeNoteIdx].paused;
  $: durationMs = notes.reduce((total, note) => {
    if (note.type === 'quarter') {
      total += 1.4; // approximate duration for quarter note
    } else {
      total += 0.7 // approximate duration for eighth note
    }
    return total;
  }, 0) * 1000;
  $: progress = durationMs === 0 ? 0 : (($timer / durationMs) || 0);
  $: fieldsChanged = activeSettings.numNotesToGenerate !== numNotesToGenerate
                  || activeSettings.key !== key
                  || activeSettings.noteType !== noteType
  

  const handlePlayPause = () => {
    notes[activeNoteIdx].paused = !paused;
    timer.toggle(paused);
  }

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
  }

  const handleUpdateNotes = () => {
    // close out current progress, then set new notes
    activeNoteIdx = 0;
    revealAnswer = false;
    timer.reset();
    notes = getNotes();
    activeSettings = { numNotesToGenerate, key, noteType }
    answerArray = getEmptyArrayOfLengthN(numNotesToGenerate)
  }
</script>

<svelte:head>
 <title>Music Notes: About</title>
</svelte:head>

<div class="settings">
  <div class="settings-row">
    <div>
      <h4>Key:</h4>
      <select bind:value={key}>
        <option value="G">G</option>
        <option value="D">D</option>
      </select>  
    </div>
    <div>
      <h4>Number of notes:</h4>
      <div class="notes-slider">
        {numNotesToGenerate}
        <input type="range" bind:value={numNotesToGenerate} max={6} min={1} step={1} list="tickmarks" />
      </div>
    </div>
    <div>
      <h4>Note type:</h4>
      <label>
        <input type=radio bind:group={noteType} name="noteType" value='eighth'>
        Eighth
      </label>
      <label>
        <input type=radio bind:group={noteType} name="noteType" value='quarter'>
        Quarter
      </label>
      <label>
        <input type=radio bind:group={noteType} name="noteType" value='mixed'>
        Mixed
      </label>
    </div>
    <button disabled={!fieldsChanged} on:click={handleUpdateNotes}>Update notes</button>
  </div>
</div>


<div class='play-progress'>
  <div class="root-note-wrapper"></div>
  <ProgressCircle {progress} on:click={handlePlayPause}>
    <img src={paused ? playIcon : pauseIcon} alt="" />
  
    {#each notes as note, idx (`${note.name}_audio_${idx}`)}
      <audio
        src={note.src}
        controls={false}
        bind:duration={note.duration}
        bind:paused={note.paused}
        on:ended={() => handleNoteFinish(idx)} 
        />
    {/each}  
  </ProgressCircle>
  <div class="root-note-wrapper">
    <button class="root-note" on:click={() => rootNotePaused = !rootNotePaused}>
      {key}
      <img src={rootNotePaused ? playIconGrey : pauseIconGrey} alt="" />
    </button>
    <audio controls={false} src={getRootNote().src} bind:paused={rootNotePaused} />
  </div>
</div>

<div class="answer-wrapper">
  <h3>Your answer</h3>
  <div class="answer-notes">
    {#each notes as note, idx (`${note.name}_input_${idx}`)}
    <select bind:value={answerArray[idx]}>
      {#each GScale as scaleNote, scaleNoteIdx (`${scaleNote}_${idx}_${scaleNoteIdx}`)}
        <option value={scaleNoteIdx + 1}>{scaleNoteIdx + 1} {scaleNote}</option>
      {/each}
    </select>  
  {/each}  
  </div>
  {#if answerArray.every(answer => answer !== '')}

    {#if compareNotesToAnswer(notes, answerArray)}
      <p class="correct-msg">Huzzah!!! You got it right!</p>
      <button on:click={handleUpdateNotes}>
        Get new notes
      </button>
    {:else}
      {#if !revealAnswer}
        <p class="incorrect-msg">Hmmm... not quite right...</p>
        <button linkLike on:click={() => revealAnswer = !revealAnswer}>
          I give up! Show me the answer.
        </button>
      {:else}
        <p>The correct answer was ...</p>
        <p class="notes-answer">
          {notes.map(note => `${note.num} ${note.value}`).join(', ')}
        </p>
        <button on:click={handleUpdateNotes}>
          Get new notes
        </button>
      {/if}
    {/if}

  {/if}
</div>

<style>
  .correct-msg, .incorrect-msg, .notes-answer {
    padding: 20px;
    border-radius: 6px;
    background-color: #ffc6c6;
    box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.1);
  }
  .correct-msg {
    background-color: #cff0d6;
  }
  .notes-answer {
    background-color: #cfebf0;
  }
  .settings {
    background-color: rgb(230, 239, 234);
    border-radius: 0px 0px 8px 8px;
    padding: 10px 20px;
    padding-bottom: 20px;
    box-sizing: border-box;
    box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.06);
    margin-bottom: 30px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .settings-row {
    display: grid;
    grid-template-columns: 20% 20% 40% 20%; 
    align-items: flex-end;
    width: 900px;
    max-width: 100%;
  }
  /* @media (max-width: 1250px) {
    TODO ADD MOBILE
  } */
  .settings-row > div {
    text-align: center;
  }
  .notes-slider {
    display: flex;
    align-items: center;
    font-size: 1.1rem;
    font-weight: bold;
    margin-left: 5px;
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
  .root-note-wrapper {
    width: 60px;
  }
  .root-note {
    background-color: #e1e1e1;
    border-radius: 50%;
    height: 50px;
    width: 50px;
    border: 2px solid #969696;
    color: #5d5d5d;
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
  .root-note:hover {
    opacity: 0.9;
    transition: opacity 0.2s linear;
  }
  .root-note-wrapper img {
    width: 12px;
    height: 19px;
  }
  .answer-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .answer-notes select {
    margin: 0px 10px;
    font-size: 1.5rem;
    padding: 10px;
  }
  h4 {
    margin-bottom: 10px;
    margin-top: 10px;
  }
</style>
