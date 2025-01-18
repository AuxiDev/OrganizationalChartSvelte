<script lang="ts">
	import OrganizationalChart from '$lib/components/OrganizationalChart/OrganizationalChart.svelte';
	import { type NodeLayout, type OrgNodeItem, NodeStyles } from '$types/chart';

	let orgChart: OrgNodeItem = {
		name: 'Top',
		style: NodeStyles.Tree,
		children: [
			{
				name: 'Child 1',
				style: NodeStyles.List,
				children: [
					{
						name: 'Child 1-1',
						style: NodeStyles.Tree,
						children: [
							{
								name: 'Child 1-1',
								style: NodeStyles.Tree,
								children: [
									{
										name: 'Child 1-1',
										style: NodeStyles.Tree,
										children: [{ name: 'Child 1-1', style: NodeStyles.Tree, children: [] }]
									},
									{
										name: 'Child 1-1',
										style: NodeStyles.Tree,
										children: [{ name: 'Child 1-1', style: NodeStyles.Tree, children: [] }]
									}
								]
							},
							{
								name: 'Child 1-2-List',
								style: NodeStyles.Tree,
								children: [
									{
										name: 'Child 1-2',
										style: NodeStyles.Tree,
										children: [
											{
												name: 'Child 1-2',
												style: NodeStyles.Tree,
												children: []
											},
											{
												name: 'Child 1-2',
												style: NodeStyles.Tree,
												children: []
											},
											{
												name: 'Child 1-2',
												style: NodeStyles.Tree,
												children: []
											}
										]
									}
								]
							},
							{
								name: 'Child 1-2',
								style: NodeStyles.Tree,
								children: []
							}
						]
					},

					{
						name: 'Child 1-2',
						style: NodeStyles.Tree,
						children: []
					}
				]
			},
			{
				name: 'Child 2',
				style: NodeStyles.Tree,
				children: [
					{
						name: 'Child 1-2',
						style: NodeStyles.List,
						children: [
							{
								name: 'Child 1-2',
								style: NodeStyles.Tree,
								children: [
									{
										name: 'Child 1-2',
										style: NodeStyles.Tree,
										children: []
									}
								]
							},
							{
								name: 'Child 1-2',
								style: NodeStyles.Tree,
								children: []
							}
						]
					},
					{
						name: 'Child 1-2',
						style: NodeStyles.Tree,
						children: []
					},
					{
						name: 'Child 1-2',
						style: NodeStyles.Tree,
						children: []
					}
				]
			},
			{
				name: 'Child 2',
				style: NodeStyles.Tree,
				children: []
			}
		]
	};
</script>

<OrganizationalChart isEditor={true} />
