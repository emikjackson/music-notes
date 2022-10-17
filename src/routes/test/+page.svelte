<script>
  let cool = [
    {
      finished: false,
    }
  ]
</script>

<button on:click={() => {
    cool = cool.map((item) => ({ ...item, finished: true }))
  }}>
  Stop all!
</button>
<p>FINISHED: {cool[0].finished}</p>


<style>
</style>
