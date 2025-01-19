<script lang="ts">
	import { createPerson, editPerson, personStore } from '$lib/stores/PersonStore';
	import { setContext } from 'svelte';
	import Dialog from '../Dialog/index';
	import Input from '../UIElements/Input/Input.svelte';
	import PersonItem from './PersonItem/PersonItem.svelte';
	import type { PersonViewerContext } from '$types/misc';
	import type { ChartPerson } from '$types/chart';
	import { get } from 'svelte/store';
	import ImageInput from '../UIElements/ImageInput/ImageInput.svelte';
	import Button from '../UIElements/Button/Button.svelte';

	let visible = $state(true);
	let isChanging = $state(false);
	let changingMode: 'ADD' | 'EDIT' = $state('ADD');
	let nameValue = $state('');
	let imageValue = $state('');
	let descriptionValue = $state('');
	let textSearch = $state('');
	let filteredPersons = $state<ChartPerson[]>(get(personStore));
	// svelte-ignore non_reactive_update
	let personToEdit: ChartPerson | undefined = $state();

	const contextValue: PersonViewerContext = {
		startEdit: (id: string) => {
			personToEdit = get(personStore).find((person) => person.id === id);
			changingMode = 'EDIT';
			isChanging = true;
			nameValue = personToEdit?.name ?? '';
			descriptionValue = personToEdit?.description ?? '';
			imageValue = personToEdit?.image ?? '';
		}
	};

	const saveChanges = () => {
		if (changingMode === 'ADD') {
			createPerson(nameValue, descriptionValue, imageValue);
		} else {
			editPerson(personToEdit?.id ?? '', {
				id: '',
				name: nameValue,
				description: descriptionValue,
				image: imageValue
			});
		}

		isChanging = false;
	};

	personStore.subscribe((state) => {
		filteredPersons = state;
	});

	const textSearchChanged = () => {
		const allPersons = get(personStore);
		filteredPersons = allPersons.filter((person) =>
			person.name.toLowerCase().includes(textSearch.toLowerCase())
		);
	};

	setContext('personViewerContext', contextValue);
</script>

<Dialog height={!isChanging ? 450 : 0} width={!isChanging ? 500 : 400} bind:visible>
	{#if !isChanging}
		<div class="person-container">
			{#each filteredPersons as person}
				<PersonItem {person} />
			{/each}
			{#if $personStore.length == 0}
				<h1 style="align-self: center;">No persons found!</h1>
			{/if}
		</div>
		<div class="toolbar-container">
			<div class="toolbar-input-container">
				<Input
					style="width: 100%;"
					oninput={textSearchChanged}
					bind:value={textSearch}
					placeholder="Search..."
				/>
				<div class="splitter"></div>
				<Button
					onclick={() => {
						changingMode = 'ADD';
						isChanging = true;
					}}
					style="height: 40px;"
					variant="primary">Add</Button
				>
			</div>
		</div>
	{:else}
		<form onsubmit={saveChanges} class="edit-container">
			{#if changingMode === 'ADD'}
				<p class="edit-title">Add a person!</p>
			{:else}
				<p class="edit-title">
					Currently editing: <span class="edit-subtitle">&nbsp;{personToEdit?.name}</span>
				</p>
			{/if}
			<div class="edit-inputs">
				<Input requiered style="width: 50%" label="Name" bind:value={nameValue} />
				<Input
					style="width: 50%"
					requiered={false}
					label="Description"
					bind:value={descriptionValue}
				/>
				<ImageInput requiered={false} bind:value={imageValue} />
			</div>
			<div class="footer-container">
				<Button type="submit" variant="primary">Save changes</Button>
				<Button onclick={() => (isChanging = false)} variant="secondary">Cancel</Button>
			</div>
		</form>
	{/if}
</Dialog>

<style>
	.toolbar-container {
		position: fixed;
		left: 50%;
		height: 70px;
		top: 0;
		width: 100%;
		transform: translateX(-50%);
		display: flex;
		gap: 20px;
		background-color: #ffffff;
		border-radius: 10px 10px 10px 10px;
		padding: 15px 20px;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
	}
	.toolbar-input-container {
		width: 100%;
		display: flex;
		flex-direction: row;
		gap: 8px;
		text-align: right;
		align-items: center;
	}

	.splitter {
		width: 1px;
		height: 30px;
		background-color: #ccc;
		margin: 0 8px;
	}

	.footer-container {
		display: flex;
		align-self: flex-end;
		margin: 20px;
		height: 40px;
		gap: 20px;
	}
	.edit-title {
		display: flex;
		font-size: 20px;
		line-height: 30px;
		margin: 20px;
	}
	.edit-subtitle {
		color: #666;
	}
	.edit-inputs {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-self: flex-end;
		align-items: flex-end;
		margin-right: 20px;
		gap: 20px;
	}
	.edit-container {
		background-color: white;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.person-container {
		padding: 20px;
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 20px;
		margin-top: 70px;
		height: 100%;
		overflow-y: auto;
	}

	.person-container::-webkit-scrollbar {
		width: 8px;
	}

	.person-container::-webkit-scrollbar-track {
		background-color: #f1f1f1;
		border-radius: 4px;
	}

	.person-container::-webkit-scrollbar-thumb {
		background-color: #888;
		border-radius: 4px;
	}

	.person-container::-webkit-scrollbar-thumb:hover {
		background-color: #555;
	}
</style>
