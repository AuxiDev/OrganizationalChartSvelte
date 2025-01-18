import ContextMenu from '$lib/components/ContextMenu/ContextMenu.svelte';
import ContextMenuItemSvelt from '$lib/components/ContextMenu/ContextMenuAction/ContextMenuItem.svelte';

export interface ContextMenuContext {
	closeMenu: () => void;
}

export type ContextMenuType = typeof ContextMenu & {
	Item: typeof ContextMenuItemSvelt;
};
