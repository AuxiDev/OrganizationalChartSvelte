<script lang="ts">
	import { createPerson, personStore } from '$lib/stores/PersonStore';
	import PersonItem from './PersonItem/PersonItem.svelte';
	import SideBar from '../UI/SideBar/SideBar.svelte';
	import { NodeStyles, type ChartPerson } from '$types/chart';
	import { get } from 'svelte/store';
	import Input from '../UI/Input/Input.svelte';
	import Button from '../UI/Button/Button.svelte';
	import Save from '../Icons/Save/Save.svelte';
	import Download from '../Icons/Download/Download.svelte';
	import Dialog from '../UI/Dialog/Dialog.svelte';
	import ImageInput from '../UI/ImageInput/ImageInput.svelte';
	import Chart from './EditorChart/EditorChart.svelte';
	import { addActionToHistory, redoAction, undoAction } from '$lib/stores/HistoryStore';
	import Undo from '../Icons/Undo/Undo.svelte';
	import Redo from '../Icons/Redo/Redo.svelte';
	import Tooltip from '../UI/Tooltip/Tooltip.svelte';
	import type { ChartJSONFormat } from '$types/misc';
	import { ChartStore } from '$lib/stores/ChartStore';
	import Upload from '../Icons/Upload/Upload.svelte';
	import Import from '../Icons/Import/Import.svelte';
	import Trash from '../Icons/Trash/Trash.svelte';
	import { uuidv4 } from '$lib/utils/helpers';

	let personName = $state('');
	let personDescription = $state('');
	let personImage = $state('');
	let svg: SVGSVGElement | null = $state(null);

	let dialogVisible = $state(false);
	let confirmDialogVisible = $state(false);

	let filteredPersons = $state<ChartPerson[]>(get(personStore));
	let textSearch = $state('');

	let isMouseDown = $state(false);
	let startX = 0;
	let startY = 0;
	let scrollLeft = 0;
	let scrollTop = 0;

	let confirmAction: 'CLEAR_DATA' | 'IMPORT';

	let chartContainer: HTMLDivElement | null = $state(null);

	const textSearchChanged = () => {
		const allPersons = get(personStore);
		filteredPersons = allPersons.filter((person) =>
			person.name.toLowerCase().includes(textSearch.toLowerCase())
		);
	};

	personStore.subscribe((state) => {
		filteredPersons = state;
		textSearchChanged();
	});

	const resetInputs = () => {
		personName = '';
		personDescription = '';
		personImage = '';
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

	const exportChartData = () => {
		let chartData: ChartJSONFormat = { persons: get(personStore), chartNodeData: get(ChartStore) };
		let jsonString = JSON.stringify(chartData, null, 2);

		const blob = new Blob([jsonString], { type: 'application/json' });

		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'organizationalChart.json';
		link.click();
		URL.revokeObjectURL(url);
	};

	const importChartData = (event: Event) => {
		const input = event.target as HTMLInputElement;
		const file = input?.files?.[0];

		if (!file) {
			console.error('No file selected');
			return;
		}

		const reader = new FileReader();

		reader.onload = () => {
			try {
				const jsonData: ChartJSONFormat = JSON.parse(reader.result as string);
				personStore.set(jsonData.persons);
				ChartStore.set(jsonData.chartNodeData);
				console.log('Chart data imported successfully');
			} catch (error) {
				console.error('Error parsing JSON:', error);
			}
		};

		reader.onerror = () => console.error('File reading error:', reader.error);

		reader.readAsText(file);
	};

	const triggerFileImport = () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'application/json';
		input.onchange = (event) => importChartData(event);
		input.click();
	};

	const clearEditorData = () => {
		let rootChartPerson: ChartPerson = { id: uuidv4(), name: 'Root', description: 'Temp' };
		personStore.set([rootChartPerson]);
		ChartStore.set({
			id: uuidv4(),
			person: rootChartPerson,
			style: NodeStyles.Connected,
			css: {
				color: '#000',
				backgroundColor: '#fff'
			},
			children: []
		});
	};
</script>

<div class="editor-container">
	<div class="toolbar-container">
		<div class="toolbar-items">
			<Tooltip text="Import Data">
				<Button
					onclick={() => {
						confirmDialogVisible = true;
						confirmAction = 'IMPORT';
					}}
					style="height: 30px; width: 30px;"
					variant="ghost"><Upload /></Button
				>
			</Tooltip>
			<Tooltip text="Export Data">
				<Button onclick={exportChartData} style="height: 30px; width: 30px;" variant="ghost"
					><Import /></Button
				>
			</Tooltip>
			<Tooltip text="Download as SVG">
				<Button style="height: 30px; width: 30px" variant="ghost" onclick={downloadSVG}
					><Download /></Button
				>
			</Tooltip>
			<Tooltip text="Undo">
				<Button style="height: 30px; width: 30px" variant="ghost" onclick={() => undoAction()}
					><Undo /></Button
				>
			</Tooltip>
			<Tooltip text="Redo">
				<Button style="height: 30px; width: 30px" variant="ghost" onclick={() => redoAction()}
					><Redo /></Button
				>
			</Tooltip>
			<Tooltip text="Clear Editor Data">
				<Button
					style="height: 30px; width: 30px"
					variant="ghost"
					onclick={() => {
						confirmDialogVisible = true;
						confirmAction = 'CLEAR_DATA';
					}}><Trash /></Button
				>
			</Tooltip>
		</div>
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
		ondragover={(event) => event.preventDefault}
		ondragend={() => (isMouseDown = false)}
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

<Dialog width={300} bind:visible={confirmDialogVisible}>
	<div class="dialog-content">
		<h1 class="dialog-title">Are you sure?</h1>
		<p>Unsaved data will be lost!</p>
		<div class="button-container" style="margin-top: 20px; gap: 20px">
			<Button
				variant="primary"
				type="button"
				onclick={() => {
					confirmDialogVisible = false;
					confirmAction === 'IMPORT' ? triggerFileImport() : clearEditorData();
				}}>Yes</Button
			>
			<Button
				onclick={() => {
					confirmDialogVisible = false;
				}}
				variant="secondary"
				type="submit">Cancel</Button
			>
		</div>
	</div>
</Dialog>

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
		overflow-x: hidden;
		height: 90vh;
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
		max-width: 50px;
		min-width: 50px;
		background-color: #f1f1f1;
	}

	.toolbar-items {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
	}

	.toolbar-items:nth-child(1) {
		margin-top: 20px;
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
