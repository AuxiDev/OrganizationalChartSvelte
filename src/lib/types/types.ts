export type OrgNodeItem = {
	name: string;
	style: NodeStyles;
	children: OrgNodeItem[];
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
