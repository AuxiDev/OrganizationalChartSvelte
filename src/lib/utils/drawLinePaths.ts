import { type NodeLayout, type OrgNodeItem, NodeStyles } from '$types/chart';

function drawTreePath(
	parentX: number,
	parentY: number,
	childX: number,
	childY: number,
	parentHeight: number
): string {
	const midX = parentX;
	const midY = parentY + (childY - parentY) / 2;

	return `
      M ${parentX},${parentY + parentHeight / 2}
      L ${midX},${midY}
      L ${childX},${midY}
      L ${childX},${childY - parentHeight / 2}
    `;
}

function drawConnectedPath(
	parentX: number,
	parentY: number,
	childX: number,
	childY: number
): string {
	const midX = parentX;
	const midY = childY;

	return `
      M ${parentX},${parentY}
      L ${midX},${midY}
      L ${childX},${midY}
      L ${childX},${childY}
    `;
}

function drawListPath(parent: NodeLayout, childX: number, childY: number): string {
	const sideX = parent.positionX - parent.width / 2 + 10;
	const sideY = childY;

	return `
      M ${sideX},${parent.positionY}
      L ${sideX},${sideY}
      L ${childX},${sideY}
      L ${childX},${childY}
    `;
}

export { drawConnectedPath, drawListPath, drawTreePath };
