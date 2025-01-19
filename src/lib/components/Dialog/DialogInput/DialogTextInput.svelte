<script lang="ts">
	let {
		requiered,
		placeholder = 'Enter something...',
		inputValue = $bindable(),
		label = 'Your Input'
	}: { requiered: boolean; placeholder: string; inputValue: any; label: string } = $props();
</script>

<div class="input-container">
	<label for="modern-input">{label}</label>
	<input required={requiered} id="modern-input" type="text" bind:value={inputValue} {placeholder} />
</div>

<style>
	.input-container {
		display: flex;
		flex-direction: row;
		gap: 8px;
		max-width: 300px;
		margin: 10px;
		text-align: right;
		align-items: center;
	}

	label {
		font-size: 16px;
		color: black;
		width: 100px;
	}

	input {
		padding: 12px 16px;
		font-size: 16px;
		border-radius: 5px;
		border: 1px solid #ccc;
		width: 180px;

		transition: all 0.3s ease;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}

	input:hover {
		border-color: #aaa;
	}
</style>
