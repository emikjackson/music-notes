<script>
  import { getRandomNotes, addPlayProperties, getRootNote } from '$lib/helpers/notes.js'
  import { getS } from '$lib/helpers/strings.js';
  import { timer } from '../stores.js';
  import Button from '$lib/Button.svelte';

  // Playing & note generation state
  let activeNoteIdx = 0;
  let numNotesToGenerate = 3;
  let noteType = 'eighth' // type should be 'quarter', 'eighth', or 'mixed'
  let paused = false;
  let durationMs = 1000;
  let progress = 0;
  let key = 'G';
  let fieldsChanged = false;
  let activeSettings = {
    numNotesToGenerate,
    key,
    noteType
  };

  // Answer state
  let answerInput = '';
  let correctAnswer = '';
  let revealAnswer = false;

  // fetch a new batch of notes based on given state (numNotesToGenerate & noteType)
  const getNotes = () => addPlayProperties(getRandomNotes(numNotesToGenerate, noteType))
  // timer.reset();

  let notes = getNotes();
  $: paused = notes[activeNoteIdx].paused;
  $: durationMs = notes.reduce((total, note) => {
    total += note.duration;
    return total;
  }, 0) * 1000;
  $: progress = durationMs === 0 ? 0 : (($timer / durationMs) || 0);
  $: correctAnswer = notes.map(note => note.num).join('')
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
    timer.reset();
    notes = getNotes();
    activeSettings = { numNotesToGenerate, key, noteType }
  }
</script>

<div class="tile">
  <!-- <p>{$timer}, {durationMs}</p> -->
  <h2>Music Note Tester</h2>
  <div class="settings">
    <div class="settings-row">
      <div>
        <h4>Key</h4>
        <select bind:value={key}>
          <option value="G">G</option>
          <option value="D">D</option>
        </select>  
      </div>
      <div>
        <p class="root-note">{key} root note</p>
        <audio controls src={getRootNote().src} />
      </div>
    </div>

    <div class="settings-row">
      <div>
        <h4>Number of notes:</h4>
        <div class="notes-slider">
          {numNotesToGenerate}
          <input type="range" bind:value={numNotesToGenerate} max={10} min={1} step={1} list="tickmarks" />
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
          Both
        </label>
      </div>
    </div>
  
    <div class="settings-footer">
      <Button disabled={!fieldsChanged} on:click={handleUpdateNotes}>Update notes</Button>
    </div>
  </div>

  <div class="play-progress">
    <Button on:click={handlePlayPause} style="padding:12px 16px;font-size:1.2rem;">
      {paused ? 'Play' : 'Pause'}
    </Button>
    <progress value="{progress}"/>
  
    {#each notes as note, idx (`${note.name}_${idx}`)}
      <audio
        src={note.src}
        controls={false}
        bind:duration={note.duration}
        bind:paused={note.paused}
        on:ended={() => handleNoteFinish(idx)} 
        />
    {/each}  
  </div>

  <div>
    <h3>Your answer</h3>
    <input bind:value={answerInput} />
    {#if answerInput.length === correctAnswer.length}
      {#if answerInput === correctAnswer}
        <div>Huzzah!!! You got it right!</div>
      {:else}
        <div>Hmmm... not quite right...</div>
      {/if}
    {/if}
  </div>


  <Button on:click={() => revealAnswer = !revealAnswer}>
    {revealAnswer ? 'Hide' : 'Reveal'} answer
  </Button>

  {#if revealAnswer}
    <p>
      {notes.map(note => note.num).join('')}
    </p>
  {/if}
</div>

<style>
  .tile {
    background-color: #FDFCFA;
    width: 90%;
    max-width: 700px;
    padding: 30px;
    margin-top: 20px;
    box-sizing: border-box;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
  }
  .settings {
    background-color: rgb(206, 236, 226);
    border-radius: 8px;
    padding: 10px 20px;
    box-sizing: border-box;
  }
  .settings-row {
    display: grid;
    grid-template-columns: 50% 50%; 
  }
  .settings-footer {
    margin-top: 10px;
    text-align: center;
  }
  .notes-slider {
    display: flex;
    align-items: center;
    font-size: 1.1rem;
    font-weight: bold;
    margin-left: 5px;
  }
  .root-note {
    margin-top: 10px;
    margin-bottom: 5px;
    font-style: italic;
    text-align: center;
    color: grey;
  }
  .play-progress {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .notes-slider input {
    margin-left: 10px;
  }
  h2 {
    text-align: center;
  }
  h4 {
    margin-bottom: 10px;
    margin-top: 10px;
  }
</style>
