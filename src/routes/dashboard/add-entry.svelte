<script lang="ts">
import { page } from '$app/state';
import { invalidateAll } from '$app/navigation';

import * as m from '$paraglide/messages';
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

<div class="flex flex-col gap-2">
	<div class="text-xl font-bold">{m.add_entry_title()}</div>
	<div>
		<DatePicker bind:value={date} />
	</div>
	<HoursPicker bind:value={hours} />
	<div class="max-w-[350px]">
		<Autocomplete placeholder="Project" options={data.projects} bind:value={project} />
	</div>
	<div>
		<Button onclick={addEntry}>{m.add_entry_button()}</Button>
	</div>
</div>
