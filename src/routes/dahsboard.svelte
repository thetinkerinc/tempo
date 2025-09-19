<script lang="ts">
import Breakdown from './breakdown.svelte';
import AddEntry from './add-entry.svelte';
import RecordSession from './record-session.svelte';
</script>

<div class="mt-5 grid grid-cols-2 gap-4">
	<div>
		<Breakdown />
	</div>
	<div>
		<AddEntry />
	</div>
</div>
<RecordSession />
