<script>
  import { getRandomNotes, addPlayProperties, getRootNote, compareNotesToAnswer } from '$lib/helpers/notes.js'
  import { GScale, DScale } from '$lib/constants/notes.js'
  import { timer } from '../stores.js';
  import Button from '$lib/Button.svelte';
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
  let scale = GScale;
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
  const getNotes = () => addPlayProperties(getRandomNotes(numNotesToGenerate, noteType, key))

  let notes = getNotes();
  $: console.log(notes)
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
  $: scale = activeSettings.key === 'G' ? GScale : DScale;

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
 <title>Music Note Tester</title>
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
    <Button disabled={!fieldsChanged} on:click={handleUpdateNotes}>Update notes</Button>
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
      {activeSettings.key}
      <img src={rootNotePaused ? playIconGrey : pauseIconGrey} alt="" />
    </button>
    Root
    <audio controls={false} src={getRootNote(activeSettings.key).src} bind:paused={rootNotePaused} />
  </div>
</div>

<div class="answer-wrapper">
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
            <label for={id}>{scaleNote} <span style="color:#aaa;margin-left: 6px;">{value}</span></label>
          </li>
        {/each}
      </ul>
    </div>
  {/each}  
  </div>
  {#if answerArray.every(answer => answer !== '')}
    {#if compareNotesToAnswer(notes, answerArray)}
      <p class="correct-msg">Huzzah!!! You got it right!</p>
      <Button on:click={handleUpdateNotes}>
        Get new notes
      </Button>
    {:else}
      {#if !revealAnswer}
        <p class="incorrect-msg">Hmmm... not quite right...</p>
        <Button link on:click={() => revealAnswer = !revealAnswer}>
          I give up! Show me the answer.
        </Button>
      {:else}
        <p style="margin-bottom: 0px;">The correct answer was ...</p>
        <p class="notes-answer">
          {notes.map(note => `${note.num} ${note.value}`).join(', ')}
        </p>
        <Button on:click={handleUpdateNotes}>
          Get new notes
        </Button>
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
    padding: 15px 20px;
    box-sizing: border-box;
    box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.06);
    margin-bottom: 30px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .settings-row {
    width: 900px;
    max-width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    column-gap: 40px;
    row-gap: 20px;
    justify-content: center;
  }

  .settings-row > div {
    text-align: center;
  }

  .settings-row h4 {
    margin-top: 5px;
  }

  @media (max-width: 800px) {
    .settings-row {
      column-gap: 15px;
      row-gap: 10px;
      transition: all 0.2s linear;
    }
    .settings {
      padding: 10px 0px 5px 0px;
      margin-bottom: 15px;
    }
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
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: grey;
    font-style: italic;
    margin-left: 10px;
    font-size: 0.8rem;
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
    margin-bottom: 60px;
  }
  h4 {
    margin-bottom: 10px;
    margin-top: 10px;
  }

  /* Button-like radio buttons */

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
    box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.08);
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

  .note-column input[type="radio"] {
    opacity: 0.01;
    z-index: 100;
  }

  .note-column input[type="radio"]:checked+label {
    background-color: #cff0d6;
  }

  .note-column label {
    padding: 5px;
    border: 1px solid #CCC;
    border-bottom: 0px solid #CCC;
    z-index: 90;
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
    border-bottom: 1px solid #CCC;
  }

  .note-column label:hover, .note-column li:hover label {
    background-color: #DDD;
    cursor: pointer;
  }

  .note-column input {
    cursor: pointer;
  }
</style>
