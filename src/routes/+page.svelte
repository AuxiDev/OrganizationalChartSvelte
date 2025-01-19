<script lang="ts">
	import ChartV2 from '$lib/components/ChartV2/ChartV2.svelte';
	import OrganizationalChart from '$lib/components/OrganizationalChart/OrganizationalChart.svelte';
	import { type NodeLayout, type OrgNodeItem, NodeStyles } from '$types/chart';

	let orgChart: OrgNodeItem = {
		name: 'Alice Johnson',
		style: NodeStyles.Connected,
		description: 'CEO',
		image: 'https://placehold.co/50x50',
		children: [
			{
				name: 'Bob Smith',
				style: NodeStyles.Tree,
				description: 'CTO',
				image: 'https://placehold.co/50x50',
				children: [
					{
						name: 'Charlie Brown',
						style: NodeStyles.Connected,
						description: 'Lead Developer',
						image: 'https://placehold.co/50x50',
						children: [
							{
								name: 'David Wilson',
								style: NodeStyles.List,
								description: 'Senior Developer',
								image: 'https://placehold.co/50x50',
								children: []
							}
						]
					},
					{
						name: 'Mia Harris',
						style: NodeStyles.Connected,
						description: 'Lead Developer',
						image: 'https://placehold.co/50x50',
						children: []
					}
				]
			},
			{
				name: 'Karen Thomas',
				style: NodeStyles.Tree,
				description: 'COO',
				image: 'https://placehold.co/50x50',
				children: []
			},
			{
				name: 'Megan Harris',
				style: NodeStyles.List,
				description: 'CFO',
				image: 'https://placehold.co/50x50',
				children: [
					{
						name: 'Larry White',
						style: NodeStyles.Connected,
						description: 'Accountant',
						image: 'https://placehold.co/50x50',
						children: []
					},
					{
						name: 'Frank Miller',
						style: NodeStyles.Tree,
						description: 'Accountant',
						image: 'https://placehold.co/50x50',
						children: []
					}
				]
			}
		]
	};
</script>

<p style="font-weight: bold; font-size: 20px; margin: 20px 20px 0px;">
	Right click a node to view editing options!
</p>
<ChartV2 />
<OrganizationalChart isEditor={true} data={orgChart} />
