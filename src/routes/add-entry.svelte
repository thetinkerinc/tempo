<script lang="ts">
import { invalidateAll } from '$app/navigation';

import * as remote from './data.remote';

import DatePicker from '$components/date-picker.svelte';
import HoursPicker from '$components/hours-picker.svelte';
import { Input } from '$components/ui/input';
import { Button } from '$components/ui/button';

let date = $state<string>('');
let hours = $state<number>(0);
let project = $state<string>();

async function addEntry() {
	await remote.addEntry({
		date,
		hours,
		project
	});
	date = '';
	hours = 0;
	project = undefined;
	await invalidateAll();
}
</script>

<DatePicker bind:value={date} />
<HoursPicker bind:value={hours} />
<Input type="text" name="project" placeholder="Project" bind:value={project} />
<Button onclick={addEntry}>Save</Button>
