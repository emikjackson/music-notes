<script>
  export let src
  export let onFinish

  let duration
  let time = 0

  $: if (duration - time < 0.0001) {
    onFinish();
  }

</script>

<div>
	<audio
    bind:duration
    bind:currentTime={time}
		{src}
		controls={true}
    >
	</audio>
  <p>Duration: {duration}</p>
  <p>Time: {time}</p>
  <progress value="{(time / duration) || 0}"/>
</div>