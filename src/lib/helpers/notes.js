import { notes } from "../constants/notes";

const quarterNotes = notes.filter(note => note.type === 'quarter');
const eighthNotes = notes.filter(note => note.type === 'quarter');

// Return random integer with exclusive maximum set [0,max)
export const getRandomInt = (max) => Math.floor(Math.random() * max);

// Return array of length 'numNotes' of random notes from given notes array
export const getRandomNotesFromArray = (numNotes, notesArray) => {
  const notes = [];
  for (let i = 0; i < numNotes; i++) {
    notes[i] = notesArray[getRandomInt(notesArray.length)];
  }
  return notes;
} 


// Return array of length 'numNotes' of random notes
// noteType should be 'quarter', 'eighth', or 'mixed'
export const getRandomNotes = (numNotes, noteType, key, includeDuplicates) => {
  if (noteType === 'quarter') {
    return getRandomNotesFromArray(numNotes, quarterNotes);
  }
  else if (noteType === 'eighth') {
    return getRandomNotesFromArray(numNotes, eighthNotes);
  }
  else {
    return getRandomNotesFromArray(numNotes, notes);
  }
}

// Add properties needed for playing (e.g. 'paused') to array of notes
export const addPlayProperties = (notes) => notes.map(note => ({ ...note, paused: true, duration: 0 }))

// Fetch the root note by given key (to use as a reference note)
export const getRootNote = () => quarterNotes.find(note => note.num === 1);