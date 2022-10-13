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

// readable stores can only be subscribed to
export const time = readable(new Date(), function start(set) {
	const interval = setInterval(() => {
		set(new Date());
	}, 1000);

	return function stop() {
		clearInterval(interval);
	};
});

// derived stores use other stores to update their value
const start = new Date();
export const elapsed = derived(
	time,
	$time => Math.round(($time - start) / 1000)
);