export type NodeLayout = {
	node: ChartNode;
	positionX: number;
	positionY: number;
	width: number;
	height: number;
};

export enum NodeStyles {
	Connected,
	List,
	Tree
}

export type ChartNode = {
	id: string;
	person: ChartPerson;
	style: NodeStyles;
	children: ChartNode[];
};

export type ChartPerson = {
	id: string;
	name: string;
	description?: string;
	image?: string;
};
