<script lang="ts">
	import type { OrgNodeItem } from '$types/types';

	let { data }: { data: OrgNodeItem } = $props();
</script>

<div class="card">
	<p>{data.name}</p>
</div>

<style>
	.card {
		height: 60px;
		width: 60px;
		background-color: white;
		border: 1px solid black;
		text-align: center;
	}
</style>
