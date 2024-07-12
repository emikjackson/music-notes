<!-- Main navigation header -->
<script>
	export let onHelpClick;
</script>

<nav>
	<a href="/">Note Sequence Guesser</a>
	<div>
		<a href="/">Play</a>
		<!-- <button on:click={onHelpClick}>Help</button> -->
		<a href="/about">About</a>
	</div>
</nav>

<style>
	nav {
		background-color: #fff;
		padding: 20px 40px;
		border-bottom: 1px solid lightgrey;
		box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);
		display: flex;
		justify-content: space-between;
		transition: padding 0.2s ease;
	}
	a,
	button {
		padding: 0px;
		margin: 0px;
		border: 0px;
		background-color: transparent;
		margin-right: 10px;
		color: #00694f;
		text-decoration: none;
	}
	nav > a:first-child {
		color: black;
		font-size: 1.2rem;
		text-decoration: none;
		font-weight: 500;
	}

	@media (max-width: 800px) {
		nav {
			padding: 13px 10px 10px 20px;
		}
	}
</style>
