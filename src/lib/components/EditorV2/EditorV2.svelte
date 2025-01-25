<script lang="ts">
	import { createPerson, personStore } from '$lib/stores/PersonStore';
	import PersonItem from './PersonItem/PersonItem.svelte';
	import SideBar from '../UI/SideBar/SideBar.svelte';
	import { type ChartPerson } from '$types/chart';
	import { get } from 'svelte/store';
	import Input from '../UI/Input/Input.svelte';
	import Button from '../UI/Button/Button.svelte';
	import ArrowRight from '../Icons/ArrowRight/ArrowRight.svelte';
	import Save from '../Icons/Save/Save.svelte';
	import Download from '../Icons/Download/Download.svelte';

	createPerson('Mia', 'CEO', 'https://placehold.co/50x50');
	createPerson('Lola', 'CFO', 'https://placehold.co/50x50');
	createPerson('Lucy', 'Developer', 'https://placehold.co/50x50');
	createPerson('Noah', 'Jr. Developer', 'https://placehold.co/50x50');

	let filteredPersons = $state<ChartPerson[]>(get(personStore));
	let textSearch = $state('');

	personStore.subscribe((state) => {
		filteredPersons = state;
	});

	const textSearchChanged = () => {
		const allPersons = get(personStore);
		filteredPersons = allPersons.filter((person) =>
			person.name.toLowerCase().includes(textSearch.toLowerCase())
		);
	};
</script>

<div class="editor-container">
	<div class="toolbar-container">
		<Button style="height: 30px; width: 30px; margin-top: 20px" variant="ghost"><Save /></Button>
		<Button style="height: 30px; width: 30px" variant="ghost"><Download /></Button>
	</div>
	<div class="chart-container">
		<h1>Edit Area</h1>
	</div>
	<div class="sidebar-container">
		<SideBar style="width: 400px;" visible={false}>
			<div class="sidebar-content">
				<div class="toolbar-input-container">
					<Input
						style="width: 100%;"
						oninput={textSearchChanged}
						bind:value={textSearch}
						placeholder="Search..."
					/>
					<div class="splitter"></div>
					<Button style="height: 40px;" variant="primary">Add</Button>
				</div>
				<div class="person-container">
					{#each filteredPersons as person}
						<PersonItem {person} />
					{/each}
				</div>
			</div>
		</SideBar>
	</div>
</div>

<style>
	.sidebar-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
	}

	.sidebar-content {
		display: flex;
		flex-direction: column;
		gap: 20px;
		flex-grow: 1;
		overflow-y: auto;
		padding: 20px;
	}

	.person-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 20px;
		overflow-y: auto;
		max-height: 90vh;
	}

	.person-container::-webkit-scrollbar {
		width: 8px;
	}

	.person-container::-webkit-scrollbar-thumb {
		background-color: #888;
		border-radius: 4px;
	}

	.person-container::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	.splitter {
		width: 1px;
		height: 30px;
		background-color: #ccc;
		margin: 0 8px;
	}

	.toolbar-input-container {
		width: 100%;
		display: flex;
		flex-direction: row;
		gap: 8px;
		text-align: right;
		align-items: center;
	}

	.editor-container {
		width: 100%;
		display: flex;
		flex-direction: row;
	}

	.toolbar-container {
		display: flex;
		flex-direction: column;
		gap: 20px;
		width: 50px;
		background-color: #f1f1f1;
		align-items: center;
	}

	.chart-container {
		flex-grow: 1;
	}
</style>
