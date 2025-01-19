<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		label,
		value = $bindable(),
		requiered = false,
		children,
		...rest
	} = $props<
		{
			label?: string;
			style?: string;
			requiered?: boolean;
			children: any;
			value?: any;
		} & Omit<HTMLAttributes<HTMLInputElement>, 'value' | 'requiered'>
	>();
</script>

<div class="input-container">
	<label for="modern-select">{label}</label>
	<select required={requiered} id="modern-select" bind:value {...rest}>
		{@render children?.()}
	</select>
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
		width: 160px;
	}

	select {
		padding: 12px 16px;
		font-size: 16px;
		border-radius: 5px;
		border: 1px solid #ccc;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		margin: 0;
	}
</style>
