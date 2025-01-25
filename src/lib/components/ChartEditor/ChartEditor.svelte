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
	import Dialog from '../UI/Dialog/Dialog.svelte';
	import ImageInput from '../UI/ImageInput/ImageInput.svelte';
	import Chart from '../OrganizationalChart/OrganizationalChart.svelte';
	import { addActionToHistory, redoAction, undoAction } from '$lib/stores/HistoryStore';
	import Undo from '../Icons/Undo/Undo.svelte';
	import Redo from '../Icons/Redo/Redo.svelte';

	createPerson('Mia', 'CEO', 'https://placehold.co/50x50');
	createPerson('Lola', 'CFO', 'https://placehold.co/50x50');
	createPerson('Lucy', 'Developer', 'https://placehold.co/50x50');
	createPerson('Noah', 'Jr. Developer', 'https://placehold.co/50x50');

	let personName = $state('');
	let personDescription = $state('');
	let personImage = $state('');
	let svg: SVGSVGElement | null = $state(null);

	let dialogVisible = $state(false);

	let filteredPersons = $state<ChartPerson[]>(get(personStore));
	let textSearch = $state('');

	let isMouseDown = $state(false);
	let startX = 0;
	let startY = 0;
	let scrollLeft = 0;
	let scrollTop = 0;

	let chartContainer: HTMLDivElement | null = $state(null);

	personStore.subscribe((state) => {
		filteredPersons = state;
	});

	const resetInputs = () => {
		personName = '';
		personDescription = '';
		personImage = '';
	};

	const textSearchChanged = () => {
		const allPersons = get(personStore);
		filteredPersons = allPersons.filter((person) =>
			person.name.toLowerCase().includes(textSearch.toLowerCase())
		);
	};

	const addPerson = () => {
		dialogVisible = false;
		let createdPerson = createPerson(personName, personDescription, personImage);
		resetInputs();
		addActionToHistory({ type: 'addPerson', data: createdPerson });
	};

	const downloadSVG = () => {
		if (!svg) return;
		const svgData = new XMLSerializer().serializeToString(svg);
		const blob = new Blob([svgData], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);

		const link = document.createElement('a');
		link.href = url;
		link.download = 'organizationalChart.svg';
		link.click();
		URL.revokeObjectURL(url);
	};

	const onMouseDown = (event: MouseEvent) => {
		isMouseDown = true;
		startX = event.pageX - (chartContainer?.offsetLeft ?? 0);
		startY = event.pageY - (chartContainer?.offsetTop ?? 0);
		scrollLeft = chartContainer?.scrollLeft ?? 0;
		scrollTop = chartContainer?.scrollTop ?? 0;
	};

	const onMouseLeave = () => {
		isMouseDown = false;
	};

	const onMouseUp = () => {
		isMouseDown = false;
	};

	const onMouseMove = (event: MouseEvent) => {
		if (!isMouseDown) return;

		event.preventDefault();

		const x = event.pageX - (chartContainer?.offsetLeft ?? 0);
		const y = event.pageY - (chartContainer?.offsetTop ?? 0);

		const walkX = x - startX;
		const walkY = y - startY;

		if (chartContainer) {
			chartContainer.scrollLeft = scrollLeft - walkX;
			chartContainer.scrollTop = scrollTop - walkY;
		}
	};
</script>

<div class="editor-container">
	<div class="toolbar-container">
		<Button style="height: 30px; width: 30px; margin-top: 20px" variant="ghost"><Save /></Button>
		<Button style="height: 30px; width: 30px" variant="ghost" onclick={downloadSVG}
			><Download /></Button
		>
		<Button style="height: 30px; width: 30px" variant="ghost" onclick={() => undoAction()}
			><Undo /></Button
		>
		<Button style="height: 30px; width: 30px" variant="ghost" onclick={() => redoAction()}
			><Redo /></Button
		>
	</div>
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="chart-container"
		role="region"
		bind:this={chartContainer}
		onmousedown={onMouseDown}
		onmouseleave={onMouseLeave}
		onmouseup={onMouseUp}
		onmousemove={onMouseMove}
		style={isMouseDown ? 'user-select: none;' : ''}
	>
		<Chart isEditor={true} bind:svgElement={svg} />
	</div>
	<SideBar style="width: 400px;" visible={true}>
		<div class="sidebar-container">
			<div class="sidebar-content">
				<div class="toolbar-input-container">
					<Input
						style="width: 100%;"
						oninput={textSearchChanged}
						bind:value={textSearch}
						placeholder="Search..."
					/>
					<div class="splitter"></div>
					<Button style="height: 40px;" variant="primary" onclick={() => (dialogVisible = true)}
						>Add</Button
					>
				</div>
				<div class="person-container">
					{#each filteredPersons as person}
						<PersonItem {person} />
					{/each}
				</div>
			</div>
		</div>
	</SideBar>
</div>

<Dialog bind:visible={dialogVisible}>
	<div class="dialog-content">
		<h1 class="dialog-title">Add person</h1>
		<form onsubmit={addPerson} class="input-container">
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
						dialogVisible = false;
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
		margin-top: 20px;
		gap: 20px;
	}
	.dialog-title {
		display: flex;
		font-size: 20px;
		line-height: 30px;
	}

	.dialog-content {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		padding: 20px;
	}
	.button-container {
		display: flex;
		flex-direction: row;
		margin-left: auto;
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
		min-width: 50px;
		background-color: #f1f1f1;
		align-items: center;
	}

	.chart-container {
		flex-grow: 1;
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		min-width: 0;
		max-height: 100dvh;
		max-width: 100%;
	}
</style>
