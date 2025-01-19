<script lang="ts">
	import { ChartStore, addNodeBelow, removeNode } from '$lib/stores/ChartStore';
	import { personStore, editPerson, createPerson, deletePerson } from '$lib/stores/PersonStore';
	import { get } from 'svelte/store';
	import PersonViewer from '../PersonViewer/PersonViewer.svelte';

	createPerson('Mia', 'CEO', 'https://placehold.co/50x50');
	createPerson('Lola', 'CFO', 'https://placehold.co/50x50');
	createPerson('Lucy', 'Developer', 'https://placehold.co/50x50');
	createPerson('Noah', 'Jr. Developer', 'https://placehold.co/50x50');
</script>

<PersonViewer />
