<script lang="ts">
	let {
		options,
		requiered,
		label = 'Your Input',
		inputValue = $bindable()
	}: {
		options: { name: String; value: any }[];
		requiered: boolean;
		label: string;
		inputValue: any;
	} = $props();
</script>

<div class="input-container">
	<label for="modern-select">{label}</label>
	<select required={requiered} id="modern-select" bind:value={inputValue}>
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
		gap: 8px;
		max-width: 300px;
		align-items: center;
		margin: 5px 10px;
		text-align: right;
	}

	label {
		font-size: 16px;
		color: black;
		width: 100px;
		margin: 0;
	}

	select {
		padding: 12px 16px;
		font-size: 16px;
		border-radius: 5px;
		border: 1px solid #ccc;
		width: 180px;
		transition: all 0.3s ease;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		margin: 0;
	}

	select:hover {
		border-color: #aaa;
	}
</style>
