<script lang="ts">
	import Card from '$lib/components/Card/SVGCard.svelte';
	import {
		calculateSubtreeHeight,
		calculateSubtreeWidth,
		correctNegativePositioning,
		generatePositions
	} from '$lib/utils/positionCalculators';
	import { drawConnectedPath, drawListPath, drawTreePath } from '$lib/utils/drawLinePaths';
	import { type NodeLayout, type OrgNodeItem, NodeStyles } from '$types/chart';
	import ContextMenu from '$lib/components/ContextMenu/index';
	import { writable, get } from 'svelte/store';
	import Dialog from '../Dialog/index';
	import { assignIds } from '$lib/utils/helpers';
	import { v4 as uuidv4 } from 'uuid';
	import Input from '../UIElements/Input/Input.svelte';
	import Button from '../UIElements/Button/Button.svelte';
	import ImageInput from '../UIElements/ImageInput/ImageInput.svelte';
	import SelectInput from '../UIElements/SelectInput/SelectInput.svelte';

	let {
		isEditor = false,
		data = {
			name: 'Root',
			style: NodeStyles.Tree,
			description: 'CEO',
			image: 'https://placehold.co/50x50',
			children: []
		}
	}: { isEditor: boolean; data?: OrgNodeItem } = $props();

	let orgChartStore = writable<OrgNodeItem>(data);
	assignIds(get(orgChartStore));

	let heightBetweenNodes = 30;

	let svgHeight = $state(800);
	let svgWidth = $state(800);

	let svg: SVGSVGElement | null = $state(null);
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
			900,
			50,
			nodeWidth,
			nodeHeight,
			heightBetweenNodes
		);

		correctNegativePositioning(temp, nodeWidth);

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

	const removeNode = (node: OrgNodeItem, id: string): boolean => {
		const index = node.children.findIndex((child) => child.id === id);
		if (index !== -1) {
			node.children.splice(index, 1);
			return true;
		}
		for (let child of node.children) {
			if (removeNode(child, id)) {
				return true;
			}
		}
		return false;
	};

	const clearPersons = () => {
		orgChartStore.update(() => {
			return {
				name: 'Root',
				style: NodeStyles.Tree,
				description: 'CEO',
				image: 'https://placehold.co/50x50',
				children: []
			};
		});
	};

	const deletePerson = () => {
		orgChartStore.update((data) => {
			removeNode(data, selectedItem.node.id ?? '');
			return data;
		});
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

		showDialog = false;
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
</script>

<Dialog height={0} bind:visible={showDialog}>
	<div class="dialog-container">
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

		<form class="dialog-form" onsubmit={handleDialogSubmit}>
			<Input requiered placeholder={'Enter Name...'} bind:value={dialogNameInput} label="Rename" />
			<SelectInput
				style="width: 100%;"
				requiered
				bind:value={dialogSelectInput}
				label="Select Style"
				><option value={NodeStyles.Tree}>Tree</option><option value={NodeStyles.Connected}
					>Connected</option
				><option value={NodeStyles.List}>List</option></SelectInput
			>
			<Input
				requiered={false}
				placeholder={'Enter Description...'}
				bind:value={dialogDescriptionInput}
				label="Description"
			/>
			<hr class="dialog-divider" style="margin: 10px 0px;" />
			<ImageInput requiered={false} bind:value={dialogImageInput} />

			<Button style="height: 40px;" variant="primary" type="submit">Submit</Button>
		</form>
	</div>
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
				dialogImageInput = selectedItem.node.image ?? '';
			}}>Edit</ContextMenu.Item
		>
		<ContextMenu.Item
			action={() => {
				dialogMode = 'Add';
				showDialog = true;
				dialogNameInput = '';
				dialogSelectInput = null;
				dialogDescriptionInput = '';
				dialogImageInput = '';
			}}>Add Person</ContextMenu.Item
		>
		<ContextMenu.Item
			action={() => {
				deletePerson();
			}}>Delete Person</ContextMenu.Item
		>
	</ContextMenu>
{/if}

<div class="editor-container">
	<div class="tool-container">
		<button style="margin: 20px 0px 0px 20px;" class="button" onclick={downloadSVG}
			>Download SVG</button
		>
		<button style="margin: 20px 0px 0px 20px;" class="button" onclick={clearPersons}
			>Clear SVG</button
		>
	</div>

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
				<Card data={item.node} height={item.height} width={item.width} layoutItem={item} />
			</foreignObject>
		{/each}
	</svg>
</div>

<style>
	.editor-container {
		display: flex;
		flex-direction: column;
	}

	.button {
		max-width: 150px;
		padding: 12px 16px;
		font-size: 16px;
		border-radius: 5px;
		border: 1px solid #ccc;
		color: white;
		background-color: #488aec;
		box-shadow:
			0 4px 6px -1px #488aec31,
			0 2px 4px -1px #488aec17;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		margin: 0;
		margin: 10px;
	}

	.button:hover {
		border-color: #aaa;
		background-color: #00affd;
		color: #fff;
	}
	svg {
		background-color: #f9f9f9;
		border: 1px solid #ddd;
		border-radius: 10px;
		margin: 20px 20px;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
	}

	.dialog-title {
		font-size: 20px;
		align-self: flex-start;
		line-height: 30px;
	}

	.dialog-subtitle {
		color: #666;
	}

	.dialog-description {
		margin-bottom: 20px;
	}

	.dialog-divider {
		width: 100%;
	}
	.dialog-container {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-end;
		padding: 20px;
	}

	.dialog-form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-self: flex-end;
		align-items: flex-end;
		margin-right: 20px;
		gap: 20px;
	}
</style>
