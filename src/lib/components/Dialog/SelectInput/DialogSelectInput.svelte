<script lang="ts">
	let {
		options,
		label = 'Your Input',
		inputValue = $bindable()
	}: { options: { name: String; value: any }[]; label: string; inputValue: any } = $props();
</script>

<div class="input-container">
	<label for="modern-select">{label}</label>
	<select id="modern-select" bind:value={inputValue}>
		<option value={''} disabled selected>Select ...</option>
		{#each options as option}
			<option value={option.value}>{option.name}</option>
		{/each}
	</select>
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

	select {
		padding: 0.75rem 1rem;
		font-size: 1rem;
		border-radius: 5px;
		border: 1px solid #ccc;
		width: 185px;
		transition: all 0.3s ease;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}

	select:hover {
		border-color: #aaa;
	}
</style>
