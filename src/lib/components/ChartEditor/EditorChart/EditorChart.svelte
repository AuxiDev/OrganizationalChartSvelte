<script lang="ts">
	import { get, writable } from 'svelte/store';
	import ContextMenu from '$lib/components/UI/ContextMenu/index';
	import { NodeStyles, type NodeLayout } from '$types/chart';
	import { drawConnectedPath, drawListPath, drawTreePath } from '$lib/utils/drawLinePaths';
	import SvgCard from '$lib/components/Card/SVGCard.svelte';
	import {
		addNodeBelow,
		ChartStore,
		findParentByIdWithIndex,
		removeNode,
		updateNode
	} from '$lib/stores/ChartStore';
	import { correctNegativePositioning, generatePositions } from '$lib/utils/positionCalculators';
	import Button from '$lib/components/UI/Button/Button.svelte';
	import Dialog from '$lib/components/UI/Dialog/Dialog.svelte';
	import SelectInput from '$lib/components/UI/SelectInput/SelectInput.svelte';
	import { findPerson, personStore } from '$lib/stores/PersonStore';
	import { onMount } from 'svelte';
	import { addActionToHistory } from '$lib/stores/HistoryStore';

	let {
		isEditor = false,
		svgElement = $bindable()
	}: { isEditor?: boolean; svgElement: SVGGElement | null } = $props();

	let showContextMenu = $state(false);
	let showDialog = $state(false);
	// svelte-ignore non_reactive_update
	let dialogMode: 'ADD' | 'EDIT' = 'ADD';
	let contextMenuPosition = $state({ x: 0, y: 0 });
	let svg: SVGGElement | null = $state(null);
	let svgHeight = $state(800);
	let svgWidth = $state(800);
	let layout = writable<NodeLayout[]>();

	let dialogPerson = $state('');
	let dialogStyle = $state(NodeStyles.Tree);

	// svelte-ignore non_reactive_update
	let selectedNode: NodeLayout;
	const nodeWidth = 200;
	const nodeHeight = 80;
	const heightBetweenNodes = 30;

	onMount(() => {
		svgElement = svg;
	});

	ChartStore.subscribe(() => {
		let generatedNodeLayout = generatePositions(
			get(ChartStore),
			900,
			50,
			nodeWidth,
			nodeHeight,
			heightBetweenNodes
		);

		correctNegativePositioning(generatedNodeLayout, nodeWidth);

		svgWidth = Math.max(...generatedNodeLayout.map((node) => node.positionX)) + nodeWidth;
		svgHeight = Math.max(...generatedNodeLayout.map((node) => node.positionY)) + nodeHeight;

		layout.set(generatedNodeLayout);
	});

	const openContextMenu = (event: MouseEvent, item: NodeLayout) => {
		event.preventDefault();
		contextMenuPosition = { x: event.clientX, y: event.clientY };
		selectedNode = item;
		showContextMenu = true;
	};

	const updateSelectedNode = () => {
		if (dialogMode === 'ADD') {
			let createdNode = addNodeBelow(selectedNode.node.id, findPerson(dialogPerson), dialogStyle);
			addActionToHistory({
				type: 'addNode',
				parentID: selectedNode.node.id,
				data: createdNode
			});
		} else {
			// Make sure selectedNode in History isn't affected by the updateNode change
			let dataOld = JSON.parse(JSON.stringify(selectedNode.node));
			updateNode(selectedNode.node.id, dialogStyle, findPerson(dialogPerson));
			addActionToHistory({
				type: 'editNode',
				dataOld: dataOld,
				dataNew: JSON.parse(JSON.stringify(selectedNode.node))
			});
		}

		showDialog = false;
	};

	const deleteNodeAction = () => {
		const result = findParentByIdWithIndex(selectedNode.node.id);
		if (result) {
			addActionToHistory({
				type: 'deleteNode',
				position: result.childIndex,
				parentID: result.parent.id,
				data: selectedNode.node
			});
		}

		removeNode(selectedNode.node.id ?? '');
	};
</script>

<div>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		bind:this={svg}
		width={svgWidth}
		height={svgHeight}
		style="font-family: sans-serif;"
	>
		<defs>
			<pattern id="dot-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
				<circle cx="10" cy="10" r="1" fill="#ddd" />
			</pattern>
		</defs>

		<rect width="100%" height="100%" fill="url(#dot-pattern)" />

		{#each $layout as parent}
			{#if parent.node.children.length > 0}
				{#each parent.node.children as child}
					{#if get(layout).find((n) => n.node === child)}
						<path
							style="stroke: #666;stroke-width: 2;fill: none;"
							d={parent.node.style === NodeStyles.Connected
								? drawConnectedPath(
										parent.positionX,
										parent.positionY,
										get(layout).find((n) => n.node === child)?.positionX ?? 0,
										get(layout).find((n) => n.node === child)?.positionY ?? 0
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
				<SvgCard data={item.node} height={item.height} width={item.width} layoutItem={item} />
			</foreignObject>
		{/each}
	</svg>
</div>

{#if showContextMenu && isEditor}
	<ContextMenu menuPosition={contextMenuPosition} bind:visible={showContextMenu}>
		<ContextMenu.Item
			onaction={() => {
				dialogMode = 'ADD';
				dialogPerson = '';
				dialogStyle = NodeStyles.Tree;
				showDialog = true;
			}}>Add Node</ContextMenu.Item
		>
		<ContextMenu.Item
			onaction={() => {
				dialogMode = 'EDIT';
				dialogPerson = selectedNode.node.person.id;
				dialogStyle = selectedNode.node.style;
				showDialog = true;
			}}>Edit Node</ContextMenu.Item
		>
		<ContextMenu.Item onaction={deleteNodeAction}>Delete Node</ContextMenu.Item>
	</ContextMenu>
{/if}

{#if isEditor}
	<Dialog bind:visible={showDialog}>
		<div class="dialog-content">
			{#if dialogMode === 'ADD'}
				<h1 class="dialog-title">Adding new Node</h1>
			{:else}
				<h1 class="dialog-title">
					Currently editing: <span class="dialog-subtitle"
						>&nbsp;{selectedNode.node.person.name}</span
					>
				</h1>
			{/if}
			<form onsubmit={updateSelectedNode} class="input-container">
				<SelectInput bind:value={dialogPerson} style="width: 100%" label="Person" requiered>
					{#each $personStore as person}
						<option value={person.id}>{person.name}</option>
					{/each}
				</SelectInput>
				<SelectInput bind:value={dialogStyle} style="width: 100%" label="Style" requiered>
					<option value={NodeStyles.Tree}>Tree</option>
					<option value={NodeStyles.Connected}>Connected</option>
					<option value={NodeStyles.List}>List</option>
				</SelectInput>
				<div class="button-container">
					<Button variant="primary" type="submit">Save</Button>
					<Button
						onclick={() => {
							showDialog = false;
						}}
						variant="secondary"
						type="submit">Cancel</Button
					>
				</div>
			</form>
		</div>
	</Dialog>
{/if}

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
		gap: 20px;
	}
</style>
