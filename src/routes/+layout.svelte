<!-- At the root level of `/routes`, this layout applies to every page! -->

<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/blog/hello-world">Blog</a>
  <a href="/form">Form</a>
</nav>

<div class="centered">
  <slot></slot>
</div>

<style>
	.centered {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>