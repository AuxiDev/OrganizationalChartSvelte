import type { ChartNode, ChartPerson } from '$types/chart';
import { get, writable } from 'svelte/store';
import { createPerson, deletePerson, editPerson } from './PersonStore';
import { addNodeBelow, addNodeBelowAtPositon, removeNode, updateNode } from './ChartStore';

type ActionMetaData = { unDone: boolean; reDone: boolean };

type Action =
	| { type: 'addNode'; parentID: string; data: ChartNode; position: number; meta?: ActionMetaData }
	| { type: 'editNode'; dataOld: ChartNode; dataNew: ChartNode; meta?: ActionMetaData }
	| {
			type: 'deleteNode';
			parentID: string;
			position: number;
			data: ChartNode;
			meta?: ActionMetaData;
	  }
	| { type: 'addPerson'; data: ChartPerson; meta?: ActionMetaData }
	| { type: 'editPerson'; dataOld: ChartPerson; dataNew: ChartPerson; meta?: ActionMetaData }
	| { type: 'deletePerson'; data: ChartPerson; meta?: ActionMetaData };

const historyStore = writable<Action[]>([]);
const historyPointer = writable(0);

const addActionToHistory = (action: Action) => {
	historyStore.update((data) => {
		const pointer = get(historyPointer);
		const newHistory = data.slice(0, pointer + 1);
		historyPointer.update(() => data.length + 1);
		return [...newHistory, { ...action, meta: { unDone: false, reDone: true } }];
	});
};

const applyAction = (action: Action) => {
	switch (action.type) {
		case 'addNode':
			if (action.position === -1) {
				addNodeBelow(
					action.parentID,
					action.data.person,
					action.data.style,
					action.data.css,
					action.data.id,
					action.data.children
				);
			} else {
				addNodeBelowAtPositon(
					action.parentID,
					action.data.person,
					action.data.style,
					action.data.id,
					action.data.children,
					action.data.css,
					action.position
				);
			}
			break;
		case 'deleteNode':
			removeNode(action.data.id);
			break;
		case 'editNode':
			updateNode(
				action.dataNew.id,
				action.dataNew.style,
				action.dataNew.person,
				action.dataNew.css
			);
			break;
		case 'addPerson':
			createPerson(action.data.name, action.data.description, action.data.image, action.data.id);
			break;
		case 'editPerson':
			editPerson(action.dataNew.id, action.dataNew);
			break;
		case 'deletePerson': {
			deletePerson(action.data.id);
		}
	}
};

const reverseAction = (action: Action) => {
	switch (action.type) {
		case 'addNode':
			removeNode(action.data.id);
			break;
		case 'deleteNode':
			{
				addNodeBelowAtPositon(
					action.parentID,
					action.data.person,
					action.data.style,
					action.data.id,
					action.data.children,
					action.data.css,
					action.position
				);
			}
			break;
		case 'editNode':
			updateNode(
				action.dataOld.id,
				action.dataOld.style,
				action.dataOld.person,
				action.dataOld.css
			);
			break;
		case 'addPerson':
			deletePerson(action.data.id);
			break;
		case 'editPerson':
			editPerson(action.dataOld.id, action.dataOld);
			break;
		case 'deletePerson': {
			createPerson(action.data.name, action.data.description, action.data.image, action.data.id);
		}
	}
};

const undoAction = () => {
	historyPointer.update((pointer) => {
		const newPointer = pointer - 1;
		if (newPointer >= 0) {
			const history = get(historyStore);
			const action = history[newPointer];
			if (action && !action.meta?.unDone) {
				if (action.meta) {
					action.meta.unDone = true;
					action.meta.reDone = false;
				}
				reverseAction(action);
				return newPointer;
			}
		}
		return pointer;
	});
};

const redoAction = () => {
	historyPointer.update((pointer) => {
		const history = get(historyStore);
		const newPointer = pointer;
		if (newPointer >= 0) {
			const action = history[newPointer];
			if (action && !action.meta?.reDone) {
				if (action.meta) {
					action.meta.reDone = true;
					action.meta.unDone = false;
				}
				applyAction(action);
				return newPointer + 1;
			}
		}

		return pointer;
	});
};

export { addActionToHistory, undoAction, redoAction };
