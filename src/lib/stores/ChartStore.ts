import { uuidv4 } from '$lib/utils/helpers';
import { NodeStyles, type ChartNode, type ChartPerson, type NodeCSSStyle } from '$types/chart';
import { writable } from 'svelte/store';
import { get } from 'svelte/store';
import { personStore } from './PersonStore';

let rootChartPerson: ChartPerson = { id: uuidv4(), name: 'Root', description: 'Temp' };
personStore.set([rootChartPerson]);
const ChartStore = writable<ChartNode>({
	id: uuidv4(),
	person: rootChartPerson,
	style: NodeStyles.Tree,
	css: { color: '#000', backgroundColor: '#fff' },
	children: []
});

const findChartNode = (node: ChartNode, id: string): ChartNode | undefined => {
	if (node.id === id) return node;
	for (let child of node.children) {
		const found = findChartNode(child, id);
		if (found) return found;
	}
	return undefined;
};

const addNodeBelow = (
	nodeID: string,
	personToAdd: ChartPerson,
	style?: NodeStyles,
	css?: NodeCSSStyle,
	id?: string,
	children?: ChartNode[]
) => {
	let createdNode = {
		id: id ?? uuidv4(),
		person: personToAdd,
		style: style ?? NodeStyles.Tree,
		css: css ?? { color: '#000', backgroundColor: '#fff' },
		children: children ?? []
	};
	ChartStore.update((data) => {
		let foundPerson = findChartNode(get(ChartStore), nodeID);
		if (foundPerson) {
			foundPerson.children.push(createdNode);
		}
		return data;
	});

	return createdNode;
};

const addNodeBelowAtPositon = (
	nodeID: string,
	personToAdd: ChartPerson,
	style?: NodeStyles,
	id?: string,
	children?: ChartNode[],
	css?: NodeCSSStyle,
	position: number = 0
) => {
	let createdNode = {
		id: id ?? uuidv4(),
		person: personToAdd,
		style: style ?? NodeStyles.Tree,
		children: children ?? [],
		css: css ?? { color: '#000', backgroundColor: '#fff' }
	};

	ChartStore.update((data) => {
		let foundPerson = findChartNode(get(ChartStore), nodeID);
		if (foundPerson) {
			foundPerson.children.splice(position, 0, createdNode);
		}
		return data;
	});

	return createdNode;
};

const removeNode = (nodeID: string) => {
	const removeNode = (node: ChartNode, id: string): boolean => {
		for (let i = 0; i < node.children.length; i++) {
			if (node.children[i].id === id) {
				node.children.splice(i, 1);
				return true;
			}
			if (removeNode(node.children[i], id)) {
				return true;
			}
		}
		return false;
	};

	let rootNode = get(ChartStore);

	removeNode(rootNode, nodeID);
	ChartStore.set(rootNode);
};

const updateNode = (nodeID: string, style: NodeStyles, person: ChartPerson, css?: NodeCSSStyle) => {
	ChartStore.update((data) => {
		const nodeToEdit = findChartNode(get(ChartStore), nodeID);
		if (nodeToEdit) {
			nodeToEdit.person = person;
			nodeToEdit.style = style;
			nodeToEdit.css = css ? css : nodeToEdit.css;
		}

		return data;
	});
};

const findParentNodeWithIndex = (
	node: ChartNode,
	id: string
): { parent: ChartNode; childIndex: number } | undefined => {
	for (let i = 0; i < node.children.length; i++) {
		if (node.children[i].id === id) {
			return { parent: node, childIndex: i };
		}
		const foundParent = findParentNodeWithIndex(node.children[i], id);
		if (foundParent) {
			return foundParent;
		}
	}
	return undefined;
};

const findParentByIdWithIndex = (nodeID: string) => {
	return findParentNodeWithIndex(get(ChartStore), nodeID);
};

export {
	ChartStore,
	addNodeBelow,
	removeNode,
	updateNode,
	findParentByIdWithIndex,
	addNodeBelowAtPositon
};
