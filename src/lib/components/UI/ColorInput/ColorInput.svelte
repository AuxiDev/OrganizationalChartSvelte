<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { onMount } from 'svelte';
	import Button from '../Button/Button.svelte';
	import Pencil from '$lib/components/Icons/Pencil/Pencil.svelte';
	import Picker from '$lib/components/Icons/Picker/Picker.svelte';
	import Tooltip from '../Tooltip/Tooltip.svelte';

	let {
		label,
		value = $bindable('#000000'),
		required = false,
		...rest
	} = $props<
		{
			label?: string;
			required?: boolean;
			value?: string;
		} & Omit<HTMLAttributes<HTMLInputElement>, 'value' | 'required'>
	>();

	let colorPreview: HTMLDivElement;
	let colorPicker: HTMLInputElement;

	const openColorPicker = () => {
		colorPicker.click();
	};

	const handleInput = (event: Event) => {
		const input = event.target as HTMLInputElement;
		const newValue = input.value;
		if (/^#[0-9A-Fa-f]{3,6}$/.test(newValue)) {
			value = newValue;
		}
	};
</script>

<div class="input-container">
	{#if label}
		<label for="input">{label}</label>
	{/if}
	<div class="color-input-wrapper">
		<input type="text" oninput={handleInput} {value} {required} {...rest} />
		<input type="color" bind:value bind:this={colorPicker} class="color-picker" />
		<div class="color-preview" style="background-color: {value};" bind:this={colorPreview}></div>
		<Tooltip text="Pick color">
			<Button
				style="width: 30px; height: 30px;"
				onclick={openColorPicker}
				variant="ghost"
				type="button"
			>
				<Picker />
			</Button>
		</Tooltip>
	</div>
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

	.color-input-wrapper {
		display: flex;
		gap: 20px;
		align-items: center;
		position: relative;
	}

	input[type='text'] {
		padding: 12px 16px;
		font-size: 16px;
		border-radius: 5px;
		border: 1px solid #ccc;
		transition: all 0.3s ease;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		width: 100px;
	}

	input[type='text']:hover {
		border-color: #aaa;
	}

	.color-picker {
		position: absolute;
		left: 50%;
		top: 0px;
		visibility: hidden;
	}

	.color-preview {
		width: 30px;
		height: 30px;
		border-radius: 5px;
		border: 1px solid #ccc;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}
</style>
