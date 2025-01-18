<script lang="ts">
	import OrganizationalChart from '$lib/components/OrganizationalChart/OrganizationalChart.svelte';
	import { type NodeLayout, type OrgNodeItem, NodeStyles } from '$types/chart';

	let orgChart: OrgNodeItem = {
		name: 'Alice Johnson',
		style: NodeStyles.Tree,
		description: 'CEO / Manager',
		image: 'https://placehold.co/50x50',
		children: [
			{
				name: 'Bob Smith',
				style: NodeStyles.List,
				description: 'Head of Department 1',
				image: 'https://placehold.co/50x50',
				children: [
					{
						name: 'Charlie Brown',
						style: NodeStyles.Tree,
						description: 'Manager 1-1',
						image: 'https://placehold.co/50x50',
						children: [
							{
								name: 'David Wilson',
								style: NodeStyles.Tree,
								description: 'Team Lead 1-1-1',
								image: 'https://placehold.co/50x50',
								children: [
									{
										name: 'Eve Davis',
										style: NodeStyles.Tree,
										description: 'Developer 1-1-1-1',
										image: 'https://placehold.co/50x50',
										children: []
									},
									{
										name: 'Frank Miller',
										style: NodeStyles.Tree,
										description: 'Developer 1-1-1-2',
										image: 'https://placehold.co/50x50',
										children: []
									}
								]
							},
							{
								name: 'Grace Lee',
								style: NodeStyles.Tree,
								description: 'Team Lead 1-1-2',
								image: 'https://placehold.co/50x50',
								children: [
									{
										name: 'Hank Moore',
										style: NodeStyles.Tree,
										description: 'Developer 1-1-2-1',
										image: 'https://placehold.co/50x50',
										children: []
									}
								]
							},
							{
								name: 'Ivy Taylor',
								style: NodeStyles.Tree,
								description: 'Manager 1-1-2',
								image: 'https://placehold.co/50x50',
								children: []
							}
						]
					},
					{
						name: 'Jack Anderson',
						style: NodeStyles.Tree,
						description: 'Manager 1-2',
						image: 'https://placehold.co/50x50',
						children: []
					}
				]
			},
			{
				name: 'Karen Thomas',
				style: NodeStyles.Tree,
				description: 'Head of Department 2',
				image: 'https://placehold.co/50x50',
				children: [
					{
						name: 'Larry White',
						style: NodeStyles.Tree,
						description: 'Manager 2-1',
						image: 'https://placehold.co/50x50',
						children: []
					}
				]
			},
			{
				name: 'Megan Harris',
				style: NodeStyles.Tree,
				description: 'Head of Department 3',
				image: 'https://placehold.co/50x50',
				children: []
			}
		]
	};
</script>

<OrganizationalChart isEditor={true} data={orgChart} />
