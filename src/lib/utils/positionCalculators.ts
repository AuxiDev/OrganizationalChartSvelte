import { type NodeLayout, type OrgNodeItem, NodeStyles } from '$types/chart';

/**
 * Calculates the total width of a subtree rooted at the given node.
 *
 * @param node - The node of the subtree you want to start the search from.
 * @param nodeWidth - The width of a single node.
 * @returns The total width of the subtree.
 */
const calculateSubtreeWidth = (node: OrgNodeItem, nodeWidth: number): number => {
	if (node.children.length === 0) {
		return nodeWidth;
	}
	const siblingPadding = (node.children.length - 1) * 30;

	let totalWidth = node.children.reduce((sum, child) => {
		return sum + calculateSubtreeWidth(child, nodeWidth);
	}, 0);

	if (node.style == NodeStyles.List) {
		let total: number = 0;
		node.children.forEach((child, index) => {
			let totalWidth = node.children.reduce((sum, child) => {
				return sum + calculateSubtreeWidth(child, nodeWidth);
			}, 0);

			total = Math.max(total, totalWidth - 300);
		});

		return totalWidth + total + siblingPadding;
	}

	return totalWidth + siblingPadding;
};

/**
 * Calculates the total height of a subtree from the given node.
 *
 * @param node - The node of the subtree you want to start the search from.
 * @param nodeHeight - The height of a single node.
 * @param verticalSpacing - The vertical spacing setting
 * @returns The total height of the subtree.
 */
const calculateSubtreeHeight = (
	node: OrgNodeItem,
	nodeHeight: number,
	verticalSpacing: number
): number => {
	if (node.children.length === 0) {
		return nodeHeight;
	}

	const maxChildHeight = Math.max(
		...node.children.map((child) => calculateSubtreeHeight(child, nodeHeight, verticalSpacing))
	);

	return nodeHeight + verticalSpacing + maxChildHeight;
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
 * @param layout - The array where the layout nodes will be stored in. Default value will be []. You can either get the result by providing your layout variable or by getting it from the return statement. (-> later returned to the top with all nodes because of recursion)
 * @returns An array of node layouts with their positions used to generate the SVG.
 */
const generatePositions = (
	node: OrgNodeItem,
	parentX: number,
	parentY: number,
	nodeWidth: number,
	nodeHeight: number,
	verticalSpacing: number,
	layout: NodeLayout[] = []
): NodeLayout[] => {
	const newLayoutItem: NodeLayout = {
		node,
		positionX: parentX,
		positionY: parentY,
		width: nodeWidth,
		height: nodeHeight
	};
	layout.push(newLayoutItem);

	if (node.children.length > 0) {
		const childY = parentY + verticalSpacing + nodeHeight;
		let totalChildWidth = calculateSubtreeWidth(node, nodeWidth);
		let firstChildX = parentX - totalChildWidth / 2;
		let currentX = firstChildX;

		if (node.style === NodeStyles.List) {
			currentX = parentX - nodeWidth / 2;
			let beforeChild: OrgNodeItem;
			node.children.forEach((child, id) => {
				const childWidth = calculateSubtreeWidth(child, nodeWidth);
				generatePositions(
					child,
					currentX + childWidth / 2 + 30,
					childY +
						(id !== 1
							? 0
							: calculateSubtreeHeight(beforeChild, nodeHeight, verticalSpacing) + verticalSpacing),
					nodeWidth,
					nodeHeight,
					verticalSpacing,
					layout
				);
				beforeChild = child;
			});
		} else {
			node.children.forEach((child, index) => {
				let childWidth = calculateSubtreeWidth(child, nodeWidth);
				generatePositions(
					child,
					currentX + childWidth / 2,
					childY,
					nodeWidth,
					nodeHeight,
					verticalSpacing,
					layout
				);
				currentX += childWidth + 30;
			});
		}
	}

	return layout;
};

export { generatePositions, calculateSubtreeWidth, calculateSubtreeHeight };
