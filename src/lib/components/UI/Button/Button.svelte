<script lang="ts">
	import { onMount } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type ButtonVariant = 'primary' | 'secondary' | 'delete' | 'action' | 'ghost';

	let { variant, type, children, disabled, ...rest } = $props<
		{
			variant: ButtonVariant;
			type?: string;
			children: any;
			disabled?: boolean;
		} & Omit<HTMLAttributes<HTMLButtonElement>, 'onClick' | 'type'>
	>();

	let isIcon = $state(false);
	let buttonElement: HTMLButtonElement | null = null;

	onMount(() => {
		if (buttonElement !== null) {
			isIcon = buttonElement.querySelector('img, svg') !== null;
		}
	});

	let buttonClasses = $derived(() => {
		const baseClasses = 'custom-button';
		const variantClass = `custom-button--${variant}`;
		const disabledClass = disabled ? 'custom-button--disabled' : '';
		return `${baseClasses} ${variantClass} ${disabledClass} ${isIcon ? 'isIcon' : ''} `;
	});
</script>

<button bind:this={buttonElement} {...rest} {type} class={buttonClasses()} {disabled}>
	{@render children?.()}
</button>

<style>
	.custom-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 8px 16px;
		font-size: 14px;
		font-weight: 600;
		border-radius: 4px;
		border: none;
		cursor: pointer;
		height: 40px;
		transition:
			background-color 0.2s,
			opacity 0.2s;
	}

	.isIcon {
		width: 40px;
		padding: 5px;
	}

	.custom-button:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
	}
	.custom-button--primary {
		background-color: #000000;
		color: #ffffff;
	}
	.custom-button--primary:hover {
		background-color: #333333;
	}
	.custom-button--secondary {
		background-color: #f1f5f8;
		color: #3d4852;
	}
	.custom-button--secondary:hover {
		background-color: #dae1e7;
	}
	.custom-button--delete {
		background-color: #e3342f;
		color: #ffffff;
	}
	.custom-button--delete:hover {
		background-color: #cc1f1a;
	}
	.custom-button--action {
		background-color: #ff9e73;
		color: #ffffff;
	}
	.custom-button--action:hover {
		background-color: #ff8c59;
	}
	.custom-button--disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.custom-button--disabled:hover {
		background-color: inherit;
	}
	.custom-button--ghost {
		background-color: transparent;
		color: black;
	}
	.custom-button--ghost:hover {
		background-color: #dae1e7;
	}

	.custom-button--ghost:focus {
		box-shadow: unset;
	}
</style>
