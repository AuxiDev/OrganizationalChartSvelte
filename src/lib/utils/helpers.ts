import type { ChartNode } from '$types/chart';
import { v4 as uuidv4 } from 'uuid';

const assignIds = (node: ChartNode) => {
	if (!node.id) {
		node.id = uuidv4();
	}
	node.children.forEach(assignIds);
};

export { assignIds };
