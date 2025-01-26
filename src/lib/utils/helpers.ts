import type { ChartNode } from '$types/chart';

const uuidv4 = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0,
			v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

const assignIds = (node: ChartNode) => {
	if (!node.id) {
		node.id = uuidv4();
	}
	node.children.forEach(assignIds);
};

export { assignIds, uuidv4 };
