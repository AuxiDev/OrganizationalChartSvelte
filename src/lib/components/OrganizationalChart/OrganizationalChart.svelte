<script lang="ts">
	import Card from '$lib/components/Card/Card.svelte';
	import { generatePositions } from '$lib/utils/positionCalculators';
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

	let showContextMenu = $state(false);
	let showDialog = $state(false);
	let dialogNameInput: string = $state('');
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
	const nodeWidth = 100;
	const nodeHeight = 60;

	orgChartStore.subscribe((value) => {
		let temp = generatePositions(
			get(orgChartStore),
			500,
			50,
			nodeWidth,
			nodeHeight,
			heightBetweenNodes
		);

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
						children: [],
						id: uuidv4()
					});
				} else {
					targetNode.name = dialogNameInput;
					targetNode.style = dialogSelectInput;
				}
			}

			return data;
		});

		dialogNameInput = '';
		dialogSelectInput = null;
	};
</script>

<Dialog bind:visible={showDialog}>
	{#if dialogMode == 'Add'}
		<h1 style="margin-left: 20px; margin-top: 20px; font-size: 20px; ">
			Add Person below <span style="color: #666;">{selectedItem.node.name}</span>
		</h1>
		<p style="margin-left: 20px;">
			Here you can add a person. You can change the name and the style.
		</p>
	{:else if dialogMode == 'Edit'}
		<h1 style="margin-left: 20px; margin-top: 20px; font-size: 20px; ">
			Editing: <span style="color: #666;">{selectedItem.node.name}</span>
		</h1>
		<p style="margin-left: 20px;">
			Here you can edit a person. You can change the name and the style.
		</p>
	{/if}

	<Dialog.InputText placeholder={'EnterName...'} bind:inputValue={dialogNameInput} label="Rename" />
	<Dialog.InputSelect
		options={[
			{ name: 'Tree', value: NodeStyles.Tree },
			{ name: 'Connected', value: NodeStyles.Connected },
			{ name: 'List', value: NodeStyles.List }
		]}
		bind:inputValue={dialogSelectInput}
		label="Select Style"
	/>
	<Dialog.SubmitButton onSubmit={() => handleDialogSubmit()}></Dialog.SubmitButton>
</Dialog>

{#if showContextMenu && isEditor}
	<ContextMenu menuPosition={contextMenuPosition} bind:visible={showContextMenu}>
		<ContextMenu.Item
			action={() => {
				dialogMode = 'Edit';
				showDialog = true;
				dialogNameInput = selectedItem.node.name;
				dialogSelectInput = selectedItem.node.style;
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

<svg width="1400" height="800">
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
</style>
