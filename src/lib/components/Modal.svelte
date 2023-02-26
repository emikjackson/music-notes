<script>
  /**
   * Simple modal wrapper (floating white tile with partial-opacity black background)
   * Pauses body scrolling when shown, resumes when cleared.
  */
	import { onDestroy, onMount } from "svelte";

  // When created, add "modal-open" class to body (prevent scrolling)
  onMount(() => document.body.classList.add('modal-open'))

  // When destroyed, remove "modal-open" class from body (restore scrolling)
  onDestroy(() => document.body.classList.remove('modal-open'))
</script>

<div class="outer-wrapper">
  <div class="modal">
    <slot />
  </div>
</div>

<style>
  .outer-wrapper {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0px;
    left: 0px;
    background-color: rgba(0,0,0,0.15);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .modal {
    background-color: white;
    width: 400px;
    max-width: 95%;
    padding: 20px;
    border-radius: 6px;
    border: 1px solid #b4b4b4;
    box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.1);
  }
</style>

