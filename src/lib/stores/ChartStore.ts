import { NodeStyles, type ChartNode, type ChartPerson, type OrgNodeItem } from '$types/chart';
import { writable } from 'svelte/store';
import { get } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

const ChartStore = writable<ChartNode>({
	id: uuidv4(),
	children: [],
	style: NodeStyles.Tree,
	person: { name: 'Root', id: uuidv4() }
});

const findChartNode = (node: ChartNode, id: string): ChartNode | undefined => {
	if (node.id === id) return node;
	for (let child of node.children) {
		const found = findChartNode(child, id);
		if (found) return found;
	}
	return undefined;
};

const addNodeBelow = (nodeID: string, personToAdd: ChartPerson, style?: NodeStyles) => {
	let foundPerson = findChartNode(get(ChartStore), nodeID);
	if (foundPerson) {
		foundPerson.children.push({
			id: uuidv4(),
			person: personToAdd,
			style: style ?? NodeStyles.Tree,
			children: []
		});
	}
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

export { ChartStore, addNodeBelow, removeNode };
