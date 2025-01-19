import type DialogV2 from '$lib/components/Dialog/Dialog.svelte';

export type DialogMenuTypeV2 = typeof DialogV2;

export interface DialogContext {
	closeMenu: () => void;
}
