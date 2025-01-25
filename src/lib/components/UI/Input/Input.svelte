<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		label,
		value = $bindable(),
		requiered = false,
		...rest
	} = $props<
		{
			label?: string;
			style?: string;
			requiered?: boolean;
			value?: any;
		} & Omit<HTMLAttributes<HTMLInputElement>, 'value' | 'requiered'>
	>();
</script>

<div class="input-container">
	{#if label}
		<label for="input">{label}</label>
	{/if}
	<input required={requiered} bind:value {...rest} />
</div>

<style>
	.input-container {
		display: flex;
		flex-direction: row;
		gap: 8px;
		width: 100%;
		text-align: right;
		align-items: center;
		justify-content: end;
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
		transition: all 0.3s ease;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}

	input:hover {
		border-color: #aaa;
	}
</style>
