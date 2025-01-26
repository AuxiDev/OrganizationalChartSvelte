import { NodeStyles, type ChartNode } from '$types/chart';
import { createPerson, personStore } from '$lib/stores/PersonStore';
import { ChartStore } from '$lib/stores/ChartStore';

personStore.set([]);
const ceo = createPerson('Mia Harris', 'CEO', 'https://placehold.co/50x50');
const cto = createPerson('John Smith', 'CTO', 'https://placehold.co/50x50');
const devManager = createPerson(
	'Alice Johnson',
	'Development Manager',
	'https://placehold.co/50x50'
);
const leadDev = createPerson('Bob Brown', 'Lead Developer', 'https://placehold.co/50x50');
const seniorDev = createPerson('Charlie Davis', 'Senior Developer', 'https://placehold.co/50x50');
const cfo = createPerson('Eve White', 'CFO', 'https://placehold.co/50x50');
const hrManager = createPerson('Grace Green', 'HR Manager', 'https://placehold.co/50x50');
const recruiter = createPerson('Hank Black', 'Recruiter', 'https://placehold.co/50x50');
const mia = createPerson('Mia Blue', 'HR Assistant', 'https://placehold.co/50x50');

const orgChart: ChartNode = {
	id: '1',
	person: ceo,
	style: NodeStyles.Connected,
	css: { color: '#000', backgroundColor: '#fff' },
	children: [
		{
			id: '2',
			person: cto,
			style: NodeStyles.Tree,
			css: { color: '#000', backgroundColor: '#fff' },
			children: [
				{
					id: '3',
					person: devManager,
					style: NodeStyles.Connected,
					css: { color: '#000', backgroundColor: '#fff' },
					children: [
						{
							id: '4',
							person: leadDev,
							style: NodeStyles.Tree,
							css: { color: '#000', backgroundColor: '#fff' },
							children: []
						}
					]
				}
			]
		},
		{
			id: '6',
			person: cfo,
			style: NodeStyles.Tree,
			css: { color: '#000', backgroundColor: '#fff' },
			children: []
		},
		{
			id: '7',
			person: hrManager,
			style: NodeStyles.List,
			css: { color: '#000', backgroundColor: '#fff' },
			children: [
				{
					id: '8',
					person: recruiter,
					style: NodeStyles.Connected,
					css: { color: '#000', backgroundColor: '#fff' },
					children: []
				},
				{
					id: '9',
					person: mia,
					style: NodeStyles.Tree,
					css: { color: '#000', backgroundColor: '#fff' },
					children: []
				}
			]
		}
	]
};

ChartStore.set(orgChart);
