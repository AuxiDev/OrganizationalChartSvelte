import type { ContextMenuType } from '$types/contextMenu';
import ContextMenu from './ContextMenu.svelte';
import ContextMenuItem from './ContextMenuAction/ContextMenuItem.svelte';

const TypedContextMenu = ContextMenu as ContextMenuType;
TypedContextMenu.Item = ContextMenuItem;

export default TypedContextMenu;
