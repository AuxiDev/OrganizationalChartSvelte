import Dialog from '$lib/components/Dialog/Dialog.svelte';
import DialogTextInput from '$lib/components/Dialog/DialogInput/DialogTextInput.svelte';
import type DialogSubmitButton from '$lib/components/Dialog/DialogSubmitButton/DialogSubmitButton.svelte';
import DialogSelectInput from '$lib/components/Dialog/SelectInput/DialogSelectInput.svelte';

export type DialogMenuType = typeof Dialog & {
	InputText: typeof DialogTextInput;
	InputSelect: typeof DialogSelectInput;
	SubmitButton: typeof DialogSubmitButton;
};

export interface DialogContext {
	closeMenu: () => void;
}
