<div class="loader"></div>

<style>
  .loader {
    border: 3px solid #f3f3f3; /* Light grey */
    border-top: 3px solid #b749d6; /* Blue */
    border-radius: 50%;
    width: 10px;
    height: 10px;
    animation: spin 2s linear infinite;
    display: inline-block;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>