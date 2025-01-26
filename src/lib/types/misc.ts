import type { ChartNode, ChartPerson } from './chart';

export interface PersonViewerContext {
	startEdit: (id: string) => void;
}

export type ChartJSONFormat = {
	persons: ChartPerson[];
	chartNodeData: ChartNode;
};

export type DragSource = 'PERSON_SIDEBAR' | 'CHART_CARD';
