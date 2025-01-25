<script lang="ts">
	import { ChartStore, addNodeBelow, removeNode } from '$lib/stores/ChartStore';
	import { personStore, editPerson, createPerson, deletePerson } from '$lib/stores/PersonStore';
	import { get } from 'svelte/store';
</script>
