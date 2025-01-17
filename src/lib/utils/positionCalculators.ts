import { type NodeLayout, type OrgNodeItem, NodeStyles } from '$types/types';

/**
 * Calculates the total width of a subtree rooted at the given node.
 *
 * @param node - The root node of the subtree.
 * @param nodeWidth - The width of a single node.
 * @returns The total width of the subtree.
 */
const calculateSubtreeWidth = (node: OrgNodeItem, nodeWidth: number): number => {
	if (node.children.length === 0) {
		return nodeWidth;
	}

	const totalWidth = node.children.reduce((sum, child) => {
		return sum + calculateSubtreeWidth(child, nodeWidth);
	}, 0);

	const siblingPadding = (node.children.length - 1) * 20;
	return totalWidth + siblingPadding;
};

/**
 * Generates the positions for each node in the organizational chart.
 *
 * @param node - The current node for which to generate positions.
 * @param parentX - The x-coordinate of the parent node.
 * @param parentY - The y-coordinate of the parent node.
 * @param nodeWidth - The width of a single node. (-> Card Width)
 * @param nodeHeight - The height of a single node. (-> Card Heigth)
 * @param verticalSpacing - The vertical spacing between nodes. (-> Free to change, for appearance)
 * @returns An array of node layouts with their positions used to generate the SVG.
 */
const generatePositions = (
	node: OrgNodeItem,
	parentX: number,
	parentY: number,
	nodeWidth: number,
	nodeHeight: number,
	verticalSpacing: number,
	layout: NodeLayout = []
): NodeLayout => {
	layout.push({
		node,
		positionX: parentX,
		positionY: parentY,
		width: nodeWidth,
		height: nodeHeight
	});

	if (node.children.length > 0) {
		const childY = parentY + verticalSpacing + nodeHeight;
		const totalChildWidth = calculateSubtreeWidth(node, nodeWidth);

		const firstChildX = parentX - totalChildWidth / 2;

		let currentX = firstChildX;
		node.children.forEach((child) => {
			const childWidth = calculateSubtreeWidth(child, nodeWidth);
			generatePositions(
				child,
				currentX + childWidth / 2,
				childY,
				nodeWidth,
				nodeHeight,
				verticalSpacing,
				layout
			);

			currentX += childWidth + 20;
		});
	}

	return layout;
};

export { generatePositions, calculateSubtreeWidth };
