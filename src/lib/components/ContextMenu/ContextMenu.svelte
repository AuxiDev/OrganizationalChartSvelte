<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import type { ContextMenuContext } from '$types/contextMenu';

	let { menuPosition = $bindable({ x: 0, y: 0 }), visible = $bindable(), children } = $props();

	const contextValue: ContextMenuContext = {
		closeMenu: () => {
			visible = false;
		}
	};

	setContext<ContextMenuContext>('contextMenu', contextValue);

	onMount(() => {
		window.addEventListener('click', closeMenu);
		return () => {
			window.removeEventListener('click', closeMenu);
		};
	});

	const closeMenu = (event: MouseEvent) => {
		if (!event.target || !(event.target as HTMLElement).closest('.context-menu')) {
			visible = false;
		}
	};

	const showMenu = (event: MouseEvent) => {
		event.preventDefault();
		visible = true;
		menuPosition.x = event.clientX;
		menuPosition.y = event.clientY;
	};
</script>

{#if visible}
	<div class="context-menu" style="left: {menuPosition.x}px; top: {menuPosition.y}px; z-index: 50;">
		<ul>
			{@render children?.()}
		</ul>
	</div>
{/if}

<style>
	.context-menu {
		position: fixed;
		background: white;
		border: 1px solid #ccc;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
		border-radius: 5px;
		padding: 5px;
	}

	ul {
		list-style-type: none;
		padding: 0;
		margin: 0;
	}
</style>
