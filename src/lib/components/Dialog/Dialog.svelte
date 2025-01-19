<script lang="ts">
	import { type DialogContext } from '$types/dialog';
	import { onMount, setContext } from 'svelte';
	import { fade } from 'svelte/transition';
	let {
		visible = $bindable(false),
		width = 400,
		height = 300,
		children,
		...rest
	}: { visible: boolean; width?: number; height?: number; children: any } = $props();

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			visible = false;
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

{#if visible}
	<div
		class="dialog-content"
		style="width: {width}px; height: {height === 0 ? 'auto' : `${height}px`};"
		transition:fade={{ duration: 300 }}
		{...rest}
	>
		{@render children?.()}
	</div>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		role="button"
		tabindex="0"
		transition:fade={{ duration: 100 }}
		onclick={() => (visible = false)}
		class="dialog-overlay"
	></div>
{/if}

<style>
	.dialog-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1;
		backdrop-filter: blur(2px);
	}

	.dialog-content {
		z-index: 2;
		position: fixed;
		display: flex;
		flex-direction: column;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 400px;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
		background-color: white;
		border-radius: 10px;
		margin: 0;
		align-items: flex-end;
	}
</style>
