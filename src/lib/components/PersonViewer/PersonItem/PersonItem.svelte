<script lang="ts">
	import Button from '$lib/components/UIElements/Button/Button.svelte';
	import { deletePerson } from '$lib/stores/PersonStore';
	import type { ChartPerson } from '$types/chart';
	import { type PersonViewerContext } from '$types/misc';
	import { getContext } from 'svelte';

	let { person }: { person: ChartPerson } = $props();

	let { startEdit } = getContext<PersonViewerContext>('personViewerContext');
	const editPerson = () => {
		startEdit(person.id);
	};
	const removePerson = () => {
		deletePerson(person.id);
	};
</script>

<div class="item-container">
	<img class="image" src={person.image ?? 'https://placehold.co/50x50'} alt={person.name} />
	<div class="text-container">
		<p class="person-name">{person.name}</p>
		<p class="person-description">{person.description}</p>
	</div>
	<div class="button-container">
		<Button onclick={editPerson} variant="primary">Edit</Button>
		<Button onclick={removePerson} variant="delete">Delete</Button>
	</div>
</div>

<style>
	.button-container {
		margin-left: auto;
		margin-right: 10px;
	}
	.item-container {
		display: flex;
		align-items: center;
		width: 100%;
		background-color: white;
		min-height: 85px;
		border-radius: 5px;
		box-shadow: 5px 10px 10px rgba(0, 0, 0, 0.1);
		gap: 20px;
	}

	.image {
		margin-left: 10px;
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
