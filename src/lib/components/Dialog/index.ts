import type { DialogMenuType } from '$types/dialog';
import Dialog from './Dialog.svelte';
import DialogTextInput from './DialogInput/DialogTextInput.svelte';
import DialogSubmitButton from './DialogSubmitButton/DialogSubmitButton.svelte';
import DialogSelectInput from './SelectInput/DialogSelectInput.svelte';

const TypedDialogMenu = Dialog as DialogMenuType;
TypedDialogMenu.InputSelect = DialogSelectInput;
TypedDialogMenu.InputText = DialogTextInput;
TypedDialogMenu.SubmitButton = DialogSubmitButton;

export default TypedDialogMenu;
