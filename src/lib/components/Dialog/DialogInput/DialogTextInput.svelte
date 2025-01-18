<script lang="ts">
	let {
		placeholder = 'Enter something...',
		inputValue = $bindable(),
		label = 'Your Input'
	}: { placeholder: string; inputValue: any; label: string } = $props();
</script>

<div class="input-container">
	<label for="modern-input">{label}</label>
	<input id="modern-input" type="text" bind:value={inputValue} {placeholder} />
</div>

<style>
	.input-container {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
		max-width: 300px;
		margin: 10px auto;
		text-align: right;
		align-items: center;
	}

	label {
		font-size: 1rem;
		color: black;
		width: 100px;
	}

	input {
		padding: 0.75rem 1rem;
		font-size: 1rem;
		border-radius: 5px;
		height: 20px;
		border: 1px solid #ccc;
		width: 150px;

		transition: all 0.3s ease;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}

	input:hover {
		border-color: #aaa;
	}
</style>
