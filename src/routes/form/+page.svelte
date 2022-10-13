<script>
  import Button from '$lib/button.svelte'
  import { onMount, onDestroy } from 'svelte';

	let name = 'world';
  let a = 1;
	let b = 2;
  let agreeToTerms = false;
  let mounted = false;

  let scoops = 1;
	let flavours = ['Mint choc chip'];

  let comments = 'Hello hello';

  let questions = [
		{ id: 1, text: `Where did you go to school?` },
		{ id: 2, text: `What is your mother's name?` },
		{ id: 3, text: `What is another personal fact?` }
	];
	let securityQuestion;
  
  const handleFormSubmit = () => alert("Form submitted! Only can call me once (on:click|once)")
  // see other event modifiers here https://svelte.dev/tutorial/event-modifiers

  let counter = 0;
  const interval = setInterval(() => counter += 1, 1000);

  onDestroy(() => clearInterval(interval));
  onMount(async () => {
    // const res = await fetch(`/tutorial/api/album`);
    // photos = await res.json();
    mounted = true;
  });
</script>

<h1>
  Form example
</h1>

<h3>Form Fields</h3>

<label>
  Name: 
  <input bind:value={name}>
</label>

<label>
  A:
	<input type=number bind:value={a} min=0 max=10>
	<input type=range bind:value={a} min=0 max=10>
</label>

<label>
  B:
	<input type=number bind:value={b} min=0 max=10>
	<input type=range bind:value={b} min=0 max=10>
</label>

<label>
	<input type=radio bind:group={scoops} name="scoops" value={1}>
	One scoop
</label>
<label>
	<input type=radio bind:group={scoops} name="scoops" value={2}>
	Two scoops
</label>
<label>
	<input type=radio bind:group={scoops} name="scoops" value={3}>
	Three scoops
</label>

<label>
	<input type=checkbox bind:group={flavours} name="flavours" value="Cookies and cream">
	Cookies and cream
</label>
<label>
	<input type=checkbox bind:group={flavours} name="flavours" value="Mint choc chip">
	Mint choc chip
</label>
<label>
	<input type=checkbox bind:group={flavours} name="flavours" value="Raspberry ripple">
	Raspberry ripple
</label>

<label>
  Comments:
  <textarea bind:value={comments}></textarea>
</label>

<label>
  Security question: 
  <select bind:value={securityQuestion} on:change="{() => console.log("switched")}">
    {#each questions as question}
      <option value={question}>
        {question.text}
      </option>
    {/each}
  </select>  
</label>

<label>
	<input type=checkbox bind:checked={agreeToTerms}>
	I agree to the terms and conditions.
</label>

{#if !agreeToTerms}
	<span class="warning">You must agree to the terms to submit</span>
{/if}

<Button disabled={!agreeToTerms} on:click|once={handleFormSubmit}>Submit</Button>

<h3>Check bindings</h3>
<span>Name: {name}</span>
<span>A + B: {a} + {b} = {a + b}</span>
<span>Agreed to terms: {agreeToTerms}</span>
<span>Scoops: {scoops}</span>
<span>Flavors: {flavours.join(', ')}</span>
<span>Comments: {comments}</span>
<span>Security question: {securityQuestion ? securityQuestion.text : 'N/A'}</span>
<span>Mounted: {mounted}</span>

<!-- Actual form example
<form on:submit|preventDefault={handleSubmit}>
	<input bind:value={answer}>

	<button disabled={!answer} type=submit>
		Submit
	</button>
</form> -->



<style>
  h3 {
    margin-bottom: 10px;
  }
  .warning {
    color: rgb(181, 19, 41);
    font-style: italic;
  }
</style>

