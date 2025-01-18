import type { DialogMenuType } from '$types/dialog';
import Dialog from './Dialog.svelte';
import DialogFileUploadInput from './DialogFileUploadInput/DialogFileUploadInput.svelte';
import DialogTextInput from './DialogInput/DialogTextInput.svelte';
import DialogSubmitButton from './DialogSubmitButton/DialogSubmitButton.svelte';
import DialogSelectInput from './SelectInput/DialogSelectInput.svelte';

const TypedDialogMenu = Dialog as DialogMenuType;
TypedDialogMenu.InputSelect = DialogSelectInput;
TypedDialogMenu.InputText = DialogTextInput;
TypedDialogMenu.SubmitButton = DialogSubmitButton;
TypedDialogMenu.InputFile = DialogFileUploadInput;

export default TypedDialogMenu;
