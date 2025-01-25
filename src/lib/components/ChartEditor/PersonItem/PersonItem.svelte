<script lang="ts">
	import Pencil from '$lib/components/Icons/Pencil/Pencil.svelte';
	import Trash from '$lib/components/Icons/Trash/Trash.svelte';
	import Button from '$lib/components/UI/Button/Button.svelte';
	import Dialog from '$lib/components/UI/Dialog/Dialog.svelte';
	import ImageInput from '$lib/components/UI/ImageInput/ImageInput.svelte';
	import Input from '$lib/components/UI/Input/Input.svelte';
	import { addActionToHistory } from '$lib/stores/HistoryStore';
	import { deletePerson, editPerson } from '$lib/stores/PersonStore';
	import type { ChartPerson } from '$types/chart';
	import { type PersonViewerContext } from '$types/misc';
	import { getContext } from 'svelte';

	let { person }: { person: ChartPerson } = $props();
	let personName = $state(person.name);
	let personDescription = $state(person.description);
	let personImage = $state(person.image);

	let editVisible = $state(false);

	const saveChanges = () => {
		editVisible = false;
		// Make sure person in History isn't affected by the updateNode change
		let dataOld: ChartPerson = JSON.parse(JSON.stringify(person));
		let editedPerson = editPerson(person.id, {
			id: '',
			name: personName,
			description: personDescription,
			image: personImage
		});

		addActionToHistory({
			type: 'editPerson',
			dataOld: dataOld,
			dataNew: JSON.parse(JSON.stringify(editedPerson))
		});

		resetInputs();
	};

	const handleDragStart = (event: DragEvent) => {
		event.dataTransfer?.setData('personID', person.id);
	};

	const resetInputs = () => {
		personName = person.name;
		personDescription = person.description;
		personImage = person.image;
	};
</script>

<div role="region" draggable={true} ondragstart={handleDragStart} class="item-container">
	{#if person.image}
		<img class="image" src={person.image ?? 'https://placehold.co/50x50'} alt={person.name} />
	{/if}
	<div class="text-container">
		<p class="person-name">{person.name}</p>
		<p class="person-description">{person.description}</p>
	</div>
	<div class="button-container">
		<Button onclick={() => (editVisible = true)} variant="ghost" style="height: 30px; width: 30px"
			><Pencil /></Button
		>
		<Button
			onclick={() => {
				deletePerson(person.id);
				addActionToHistory({ type: 'deletePerson', data: person });
			}}
			variant="ghost"
			style="height: 30px; width: 30px"><Trash /></Button
		>
	</div>
</div>

<Dialog bind:visible={editVisible}>
	<div class="dialog-content">
		<h1 class="dialog-title">
			Currently editing: <span class="dialog-subtitle">&nbsp;{person.name}</span>
		</h1>
		<form onsubmit={saveChanges} class="input-container">
			<Input bind:value={personName} placeholder="Name..." label="Name" requiered />
			<Input
				bind:value={personDescription}
				placeholder="Description..."
				label="Description"
				requiered
			/>
			<ImageInput bind:value={personImage} />
			<div class="button-container" style="gap: 20px;">
				<Button variant="primary" type="submit">Save</Button>
				<Button
					onclick={() => {
						editVisible = false;
						resetInputs();
					}}
					variant="secondary"
					type="submit">Cancel</Button
				>
			</div>
		</form>
	</div>
</Dialog>

<style>
	.input-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-self: flex-end;
		align-items: flex-end;
		margin-right: 20px;
		gap: 20px;
		margin-top: 20px;
	}
	.dialog-title {
		display: flex;
		font-size: 20px;
		line-height: 30px;
	}
	.dialog-subtitle {
		color: #666;
	}
	.dialog-content {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		padding: 20px;
	}
	.button-container {
		margin-left: auto;
		display: flex;
		flex-direction: row;
	}

	.item-container {
		display: flex;
		align-items: center;
		width: 100%;
		background-color: white;
		min-height: 85px;
		border-radius: 5px;
		box-shadow: 5px 10px 10px rgba(0, 0, 0, 0.2);
		gap: 20px;
		padding: 20px;
	}

	.image {
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}

	.text-container {
		display: flex;
		flex-direction: column;
	}

	.person-name {
		font-size: 20px;
		font-weight: bold;
	}

	.person-description {
		font-size: 16px;
	}
</style>
