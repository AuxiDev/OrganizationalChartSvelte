<script lang="ts">
	import type { DialogContext } from '$types/dialog';
	import { getContext } from 'svelte';

	let { onSubmit } = $props<{ onSubmit: () => void }>();
	const { closeMenu } = getContext<DialogContext>('contextDialog');
	const handleSubmit = (event: MouseEvent) => {
		closeMenu();
		onSubmit();
	};
</script>

<button class="submit-button" onclick={handleSubmit}> Submit </button>

<style>
	.submit-button {
		padding: 0.75rem 1rem;
		font-size: 1rem;
		border-radius: 5px;
		border: 1px solid #ccc;
		color: white;
		background-color: black;
		cursor: pointer;
		margin: 20px 20px;
		width: 100px;
		align-self: flex-end;
		transition: all 0.3s ease;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}

	.submit-button:hover {
		border-color: #aaa;
		background-color: #e0e0e0;
	}
</style>
