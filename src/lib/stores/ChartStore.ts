import { NodeStyles, type ChartNode, type ChartPerson, type NodeCSSStyle } from '$types/chart';
import { writable } from 'svelte/store';
import { get } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

const testPerson1: ChartPerson = {
	id: '1',
	name: 'Alice Johnson',
	description: 'CEO',
	image: 'https://placehold.co/50x50'
};

const testPerson2: ChartPerson = {
	id: '2',
	name: 'Bob Smith',
	description: 'CTO',
	image: 'https://placehold.co/50x50'
};

const testPerson3: ChartPerson = {
	id: '3',
	name: 'Charlie Brown',
	description: 'Lead Developer',
	image: 'https://placehold.co/50x50'
};

const testPerson4: ChartPerson = {
	id: '4',
	name: 'David Wilson',
	description: 'Senior Developer',
	image: 'https://placehold.co/50x50'
};

const testPerson5: ChartPerson = {
	id: '5',
	name: 'Mia Harris',
	description: 'Lead Developer',
	image: 'https://placehold.co/50x50'
};

const testPerson6: ChartPerson = {
	id: '6',
	name: 'Karen Thomas',
	description: 'COO',
	image: 'https://placehold.co/50x50'
};

const testPerson7: ChartPerson = {
	id: '7',
	name: 'Megan Harris',
	description: 'CFO',
	image: 'https://placehold.co/50x50'
};

const testPerson8: ChartPerson = {
	id: '8',
	name: 'Larry White',
	description: 'Accountant',
	image: 'https://placehold.co/50x50'
};

const testPerson9: ChartPerson = {
	id: '9',
	name: 'Frank Miller',
	description: 'Accountant',
	image: 'https://placehold.co/50x50'
};

// New chart structure
const orgChart: ChartNode = {
	id: '1',
	person: testPerson1,
	style: NodeStyles.Connected,
	css: { color: '#000', backgroundColor: '#fff' },
	children: [
		{
			id: '2',
			person: testPerson2,
			style: NodeStyles.Tree,
			css: { color: '#000', backgroundColor: '#fff' },
			children: [
				{
					id: '3',
					person: testPerson3,
					style: NodeStyles.Connected,
					css: { color: '#000', backgroundColor: '#fff' },
					children: [
						{
							id: '4',
							person: testPerson4,
							style: NodeStyles.List,
							css: { color: '#000', backgroundColor: '#fff' },
							children: []
						}
					]
				},
				{
					id: '5',
					person: testPerson5,
					style: NodeStyles.Connected,
					children: [],
					css: { color: '#000', backgroundColor: '#fff' }
				}
			]
		},
		{
			id: '6',
			person: testPerson6,
			style: NodeStyles.Tree,
			css: { color: '#000', backgroundColor: '#fff' },
			children: []
		},
		{
			id: '7',
			person: testPerson7,
			style: NodeStyles.List,
			css: { color: '#000', backgroundColor: '#fff' },
			children: [
				{
					id: '8',
					person: testPerson8,
					style: NodeStyles.Connected,
					css: { color: '#000', backgroundColor: '#fff' },
					children: []
				},
				{
					id: '9',
					person: testPerson9,
					style: NodeStyles.Tree,
					css: { color: '#000', backgroundColor: '#fff' },
					children: []
				},
				{
					id: '10',
					person: testPerson9,
					style: NodeStyles.Tree,
					css: { color: '#000', backgroundColor: '#fff' },
					children: []
				}
			]
		}
	]
};

const ChartStore = writable<ChartNode>(orgChart);

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
