<script lang="ts">
	import Card from '$lib/components/Card/Card.svelte';
	import {
		calculateSubtreeHeight,
		calculateSubtreeWidth,
		generatePositions
	} from '$lib/utils/positionCalculators';
	import { drawConnectedPath, drawListPath, drawTreePath } from '$lib/utils/drawLinePaths';
	import { type NodeLayout, type OrgNodeItem, NodeStyles } from '$types/chart';
	import ContextMenu from '$lib/components/ContextMenu/index';
	import { writable, get } from 'svelte/store';
	import Dialog from '../Dialog/index';
	import { assignIds } from '$lib/utils/helpers';
	import { v4 as uuidv4 } from 'uuid';

	let { isEditor = false, data = {} }: { isEditor: boolean; data?: any } = $props();

	let orgChartStore = writable<OrgNodeItem>({
		...data,
		name: data.name || 'Root',
		style: data.style || NodeStyles.Tree,
		children: data.children || []
	});
	assignIds(get(orgChartStore));

	let heightBetweenNodes = 30;

	let svgHeight = $state(800);
	let svgWidth = $state(800);

	let showContextMenu = $state(false);
	let showDialog = $state(false);
	let dialogNameInput: string = $state('');
	let dialogImageInput: string = $state('');
	let dialogDescriptionInput: string = $state('');
	let dialogSelectInput: NodeStyles | null = $state(null);
	// svelte-ignore non_reactive_update
	let dialogMode: 'Edit' | 'Add' = 'Add';
	let contextMenuPosition = $state({ x: 0, y: 0 });
	// svelte-ignore non_reactive_update
	let selectedItem: NodeLayout;

	const openContextMenu = (event: MouseEvent, item: NodeLayout) => {
		event.preventDefault();
		contextMenuPosition = { x: event.clientX, y: event.clientY };
		selectedItem = item;
		showContextMenu = true;
	};

	// svelte-ignore non_reactive_update
	let layout = writable<NodeLayout[]>();
	const nodeWidth = 200;
	const nodeHeight = 80;

	orgChartStore.subscribe((value) => {
		let temp = generatePositions(
			get(orgChartStore),
			500,
			50,
			nodeWidth,
			nodeHeight,
			heightBetweenNodes
		);

		svgWidth = Math.max(...temp.map((node) => node.positionX)) + nodeWidth;
		svgHeight = Math.max(...temp.map((node) => node.positionY)) + nodeHeight;

		layout.set(temp);
	});

	const findNode = (node: OrgNodeItem, id: string): any => {
		if (node.id === id) return node;
		for (let child of node.children) {
			const found = findNode(child, id);
			if (found) return found;
		}
		return null;
	};

	const handleDialogSubmit = () => {
		orgChartStore.update((data) => {
			const targetNode = findNode(data, selectedItem.node.id ?? '');

			if (targetNode) {
				if (dialogMode === 'Add') {
					targetNode.children.push({
						name: dialogNameInput,
						style: dialogSelectInput,
						description: dialogDescriptionInput,
						image: dialogImageInput,
						children: [],
						id: uuidv4()
					});
				} else {
					targetNode.name = dialogNameInput;
					targetNode.style = dialogSelectInput;
					targetNode.description = dialogDescriptionInput;
					targetNode.image = dialogImageInput;
				}
			}

			return data;
		});

		dialogNameInput = '';
		dialogSelectInput = null;
		dialogDescriptionInput = '';
	};
</script>

<Dialog bind:visible={showDialog} onSubmit={() => handleDialogSubmit()}>
	{#if dialogMode == 'Add'}
		<h1 class="dialog-title">
			Add Person below <span class="dialog-subtitle">{selectedItem.node.name}</span>
		</h1>
		<p class="dialog-description">
			Here you can add a person. You can change the name and the style.
		</p>
	{:else if dialogMode == 'Edit'}
		<h1 class="dialog-title">
			Editing: <span class="dialog-subtitle">{selectedItem.node.name}</span>
		</h1>
		<p class="dialog-description">
			Here you can edit a person. You can change the name and the style.
		</p>
	{/if}

	<Dialog.InputText
		requiered={true}
		placeholder={'Enter Name...'}
		bind:inputValue={dialogNameInput}
		label="Rename"
	/>
	<Dialog.InputSelect
		requiered={true}
		options={[
			{ name: 'Tree', value: NodeStyles.Tree },
			{ name: 'Connected', value: NodeStyles.Connected },
			{ name: 'List', value: NodeStyles.List }
		]}
		bind:inputValue={dialogSelectInput}
		label="Select Style"
	/>
	<Dialog.InputText
		requiered={false}
		placeholder={'Enter Description...'}
		bind:inputValue={dialogDescriptionInput}
		label="Description"
	/>
	<hr class="dialog-divider" />
	<Dialog.InputFile requiered={false} bind:inputValue={dialogImageInput} label="Description" />

	<Dialog.SubmitButton></Dialog.SubmitButton>
</Dialog>

{#if showContextMenu && isEditor}
	<ContextMenu menuPosition={contextMenuPosition} bind:visible={showContextMenu}>
		<ContextMenu.Item
			action={() => {
				dialogMode = 'Edit';
				showDialog = true;
				dialogNameInput = selectedItem.node.name;
				dialogSelectInput = selectedItem.node.style;
				dialogDescriptionInput = selectedItem.node.description ?? '';
			}}>Edit</ContextMenu.Item
		>
		<ContextMenu.Item
			action={() => {
				dialogMode = 'Add';
				showDialog = true;
			}}>Add Person</ContextMenu.Item
		>
	</ContextMenu>
{/if}

<svg width={svgWidth} height={svgHeight}>
	<defs>
		<pattern id="dot-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
			<circle cx="10" cy="10" r="1" fill="#ddd" />
		</pattern>
	</defs>

	<rect width="100%" height="100%" fill="url(#dot-pattern)" />

	{#each $layout as parent}
		{#if parent.node.children.length > 0}
			{#each parent.node.children as child}
				{#if get(layout).find((n: any) => n.node === child)}
					<path
						class="line"
						d={parent.node.style === NodeStyles.Connected
							? drawConnectedPath(
									parent.positionX,
									parent.positionY,
									get(layout).find((n) => n.node === child)?.positionX ?? 0,
									get(layout).find((n) => n.node === child)?.positionY ?? 0,
									parent.height
								)
							: parent.node.style === NodeStyles.Tree
								? drawTreePath(
										parent.positionX,
										parent.positionY,
										get(layout).find((n) => n.node === child)?.positionX ?? 0,
										get(layout).find((n) => n.node === child)?.positionY ?? 0,
										parent.height
									)
								: drawListPath(
										parent,
										get(layout).find((n) => n.node === child)?.positionX ?? 0,
										get(layout).find((n) => n.node === child)?.positionY ?? 0
									)}
					/>
				{/if}
			{/each}
		{/if}
	{/each}

	{#each $layout as item}
		<foreignObject
			x={item.positionX - item.width / 2}
			y={item.positionY - item.height / 2}
			width={nodeWidth + 5}
			height={nodeHeight + 5}
			oncontextmenu={(event) => openContextMenu(event, item)}
			role="group"
		>
			<Card data={item.node} height={item.height} width={item.width} layoutItem={item} />
		</foreignObject>
	{/each}
</svg>

<style>
	svg {
		background-color: #f9f9f9;
		border: 1px solid #ddd;
		border-radius: 10px;
		margin: 20px 20px;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
	}

	.line {
		stroke: #666;
		stroke-width: 2;
		fill: none;
	}

	.dialog-title {
		margin-left: 20px;
		margin-top: 20px;
		font-size: 20px;
		align-self: flex-start;
	}

	.dialog-subtitle {
		color: #666;
	}

	.dialog-description {
		margin-left: 20px;
	}

	.dialog-divider {
		width: 100%;
	}
	svg {
		background-color: #f9f9f9;
		border: 1px solid #ddd;
		border-radius: 10px;
		margin: 20px 20px;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
	}

	.line {
		stroke: #666;
		stroke-width: 2;
		fill: none;
	}
</style>
