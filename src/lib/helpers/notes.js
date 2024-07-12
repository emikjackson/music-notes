import { GNotes, DNotes, pitchByNote, EIGHTH_NOTE_DURATION_MS } from '../constants/notes';

export const getQuarterNotes = (notes) => notes.filter((note) => note.type === 'quarter');
export const getEighthNotes = (notes) => notes.filter((note) => note.type === 'eighth');

// Return random integer with exclusive maximum set [0,max)
export const getRandomInt = (max) => Math.floor(Math.random() * max);

// Return array of length 'numNotes' of random notes from given notes array
export const getRandomNotesFromArray = (numNotes, notesArray) => {
	const notes = [];
	for (let i = 0; i < numNotes; i++) {
		notes[i] = notesArray[getRandomInt(notesArray.length)];
	}
	return notes;
};

// Return array of length 'numNotes' of random notes
// noteType should be 'quarter', 'eighth', or 'mixed'
export const getRandomNotes = (numNotes, noteType, key, includeDuplicates) => {
	const notes = key === 'G' ? GNotes : DNotes;
	if (noteType === 'quarter') {
		return getRandomNotesFromArray(numNotes, getQuarterNotes(notes));
	} else if (noteType === 'eighth') {
		return getRandomNotesFromArray(numNotes, getEighthNotes(notes));
	} else {
		return getRandomNotesFromArray(numNotes, notes);
	}
};

// Add properties needed for playing (e.g. 'paused') to array of notes
export const addPlayProperties = (notes) =>
	notes.map((note) => ({ ...note, paused: true, duration: 0 }));

// Fetch the root note by given key (to use as a reference note)
export const getRootNote = (key) =>
	getQuarterNotes(key === 'G' ? GNotes : DNotes).find((note) => note.num === 1);

// Return true if notes match answer
export const compareNotesToAnswer = (notes, answers) => {
	for (let i = 0; i < notes.length; i++) {
		if (notes[i].num !== answers[i]) {
			return false;
		}
	}
	return true;
};

// https://marcgg.com/blog/2016/11/01/javascript-audio/
export const playSyntheticNote = (note, onFinish) => {
	const octave = note.value > note.key ? 5 : 4; // maybe make this variable
	const noteName = `${note.value}${octave}`;
	const durationMs = note.type === 'eighth' ? EIGHTH_NOTE_DURATION_MS : EIGHTH_NOTE_DURATION_MS * 2;
	const fade = 3;
	const context = new AudioContext();
	let o = context.createOscillator();
	let g = context.createGain();

	o.type = 'type';
	// o.setPeriodicWave(stringWave(context));
	o.connect(g);
	o.frequency.value = pitchByNote[noteName];
	g.connect(context.destination);

	// Finally this schedules the fade out.
	g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + fade);

	o.start(context.currentTime);

	// Clear the audio context after note is finished playing
	const timeout = setTimeout(() => {
		context.close();
		onFinish();
	}, durationMs);

	// Return function to cancel note and clear timeout
	return () => {
		clearTimeout(timeout);
		context.close();
	};
};
