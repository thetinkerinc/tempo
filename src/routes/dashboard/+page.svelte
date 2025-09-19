<script lang="ts">
import Breakdown from './breakdown.svelte';
import AddEntry from './add-entry.svelte';
import RecordSession from './record-session.svelte';
</script>

<svelte:head>
	<title>Tempo</title>
</svelte:head>
<div class="mt-5 grid grid-rows-[auto_auto] gap-4 lg:grid-cols-2 lg:grid-rows-1">
	<div>
		<Breakdown />
	</div>
	<div>
		<AddEntry />
	</div>
</div>
<RecordSession />
