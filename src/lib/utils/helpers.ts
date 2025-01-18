import type { OrgNodeItem } from '$types/chart';
import { v4 as uuidv4 } from 'uuid';

const assignIds = (node: OrgNodeItem) => {
	if (!node.id) {
		node.id = uuidv4();
	}
	node.children.forEach(assignIds);
};

export { assignIds };
