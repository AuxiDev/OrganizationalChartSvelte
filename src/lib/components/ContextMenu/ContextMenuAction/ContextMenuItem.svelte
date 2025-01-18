<script lang="ts">
	import { getContext } from 'svelte';
	import type { ContextMenuContext } from '$types/contextMenu';

	let { action, children } = $props<{ action: () => void; children: any }>();
	const { closeMenu } = getContext<ContextMenuContext>('contextMenu');

	function handleClick() {
		action();
		closeMenu();
	}
</script>

<li>
	<button onclick={handleClick} class="context-menu-item">
		{@render children?.()}
	</button>
</li>

<style>
	.context-menu-item {
		display: block;
		width: 100%;
		padding: 8px 12px;
		text-align: left;
		background: none;
		border: none;
		cursor: pointer;
	}

	.context-menu-item:hover {
		background-color: #f0f0f0;
	}
</style>
