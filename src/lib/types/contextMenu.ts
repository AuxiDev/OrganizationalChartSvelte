import ContextMenu from '$lib/components/UI/ContextMenu/ContextMenu.svelte';
import ContextMenuItemSvelt from '$lib/components/UI/ContextMenu/ContextMenuAction/ContextMenuItem.svelte';

export interface ContextMenuContext {
	closeMenu: () => void;
}

export type ContextMenuType = typeof ContextMenu & {
	Item: typeof ContextMenuItemSvelt;
};
