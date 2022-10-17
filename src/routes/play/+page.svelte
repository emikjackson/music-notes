<script>
  import { getRandomNotes, addPlayProperties, getRootNote } from '$lib/helpers/notes.js'
  import { getS } from '$lib/helpers/strings.js';
  import { timer } from '../../stores.js';

  // Playing & note generation state
  let activeNoteIdx = 0;
  let numNotesToGenerate = 3;
  let noteType = 'eighth' // type should be 'quarter', 'eighth', or 'mixed'
  let paused = false;
  let durationMs = 1000;
  let progress = 0;

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

  const generateNewNotes = () => {
    // close out current progress, then set new notes
    activeNoteIdx = 0;
    timer.reset();
    notes = getNotes();
  }
</script>

<!-- <p>{$timer}, {durationMs}</p> -->
<p>Key of G, root not:</p>
<audio controls src={getRootNote().src} />
<br/><br/>
<button on:click={handlePlayPause}>
  {paused ? 'Play' : 'Pause'}
</button>
<progress value="{progress}"/>
<h3>{numNotesToGenerate} Note{getS(numNotesToGenerate)}</h3>
<label>
  Num notes:
  <input type="range" bind:value={numNotesToGenerate} max={10} min={1} step={1} list="tickmarks" />
</label>
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

<button on:click={generateNewNotes}>Generate new notes</button>

{#each notes as note, idx (`${note.name}_${idx}`)}
  <audio
    src={note.src}
    controls={false}
    bind:duration={note.duration}
    bind:paused={note.paused}
    on:ended={() => handleNoteFinish(idx)} 
    />
{/each}

<input bind:value={answerInput} />

{#if answerInput.length === correctAnswer.length}
  {#if answerInput === correctAnswer}
    <div>Huzzah!!! You got it right!</div>
  {:else}
    <div>Hmmm... not quite right...</div>
  {/if}
{/if}

<button on:click={() => revealAnswer = !revealAnswer}>
  {revealAnswer ? 'Hide' : 'Reveal'} answer
</button>

{#if revealAnswer}
  <p>
    {notes.map(note => note.num).join('')}
  </p>
{/if}

<style>
  audio {
    margin-top: 10px;
  }
</style>