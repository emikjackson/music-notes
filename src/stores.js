import { writable, readable, derived } from 'svelte/store';

// writeable stores have set, update, and subscribe functionality
export const count = writable(0);

// We can create custom stores, as long as they have a subscribe method
function createFancierCount() {
	const { subscribe, set, update } = writable(0);

	return {
		subscribe,
		increment: () => update(n => n + 1),
		decrement: () => update(n => n - 1),
		reset: () => set(0)
	};
}
export const fancierCount = createFancierCount();

// We can create custom stores, as long as they have a subscribe method
function createNotes() {
	const { subscribe, set, update } = writable([]);

	return {
		subscribe,
		setNotes: (newNotes) => set(newNotes),
		playNote: (noteIndex) => update(notes => notes.map((note, index) => index === noteIndex ? { ...note, paused: false } : note)),
		finish: (noteIndex) => update(notes => notes.map((note, index) => index === noteIndex ? { ...note, finished: true } : note)),
	};
}
export const notes = createNotes();

// readable stores can only be subscribed to
export const time = readable(new Date(), function start(set) {
	const interval = setInterval(() => {
		set(new Date());
	}, 1000);

	return function stop() {
		clearInterval(interval);
	};
});

// readable stores can only be subscribed to
const createTimer = () => {
	const { subscribe, set, update } = writable(0);
	let interval = null
	const intervalDurationMs = 100;

	const toggle = (paused) => {
		if (paused) {
			if (interval != null) {
				clearInterval(interval);
			}
			interval = setInterval(() => {
				update(valueMs => valueMs + intervalDurationMs)
			}, intervalDurationMs);
		} else {
			clearInterval(interval);
		}
	};

	const reset = () => {
		clearInterval(interval);
		set(0);
	}

	return {
		subscribe,
		reset,
		toggle,
	};
};
export const timer = createTimer();

// derived stores use other stores to update their value
const start = new Date();
export const elapsed = derived(
	time,
	$time => Math.round(($time - start) / 1000)
);