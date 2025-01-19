export type OrgNodeItem = {
	name: string;
	description?: string;
	image?: string;
	style: NodeStyles;
	children: OrgNodeItem[];
	id?: string;
};

export type NodeLayout = {
	node: OrgNodeItem;
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
