<script lang="ts">
import { page } from '$app/state';
import { invalidateAll } from '$app/navigation';

import * as remote from './data.remote';

import DatePicker from '$components/date-picker.svelte';
import HoursPicker from '$components/hours-picker.svelte';
import Autocomplete from '$components/autocomplete.svelte';
import { Button } from '$components/ui/button';

import type { PageData } from './$types';

let date = $state<string>('');
let hours = $state<number>(0);
let project = $state<string>();

let data = $derived(page.data as PageData);

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
<Autocomplete placeholder="Project" options={data.projects} bind:value={project} />
<Button onclick={addEntry}>Save</Button>
