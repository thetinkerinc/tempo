<script lang="ts">
import Breakdown from './breakdown.svelte';
import AddEntry from './add-entry.svelte';
import RecordSession from './record-session.svelte';
</script>

<svelte:head>
	<title>Tempo</title>
</svelte:head>
<div
	class="mt-5 grid grid-rows-[auto_auto] gap-4 px-4 lg:grid-cols-[auto_1fr] lg:grid-rows-1 lg:gap-8 lg:pr-8">
	<div>
		<AddEntry />
	</div>
	<div>
		<Breakdown />
	</div>
</div>
<RecordSession />
