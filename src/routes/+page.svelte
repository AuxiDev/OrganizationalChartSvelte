<script lang="ts">
	import ChartEditor from '$lib/components/ChartEditor/ChartEditor.svelte';
	import OrganizationalChart from '$lib/components/OrganizationalChart/OrganizationalChart.svelte';
	import { type NodeLayout, type OrgNodeItem, NodeStyles } from '$types/chart';

	let orgChart: OrgNodeItem = {
		name: 'Root',
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

<ChartEditor />

<OrganizationalChart data={orgChart} />
