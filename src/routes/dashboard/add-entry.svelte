<script lang="ts">
import * as m from '$paraglide/messages';
import { getProjects, addEntry } from '$remote/entry.remote';
import schema from '$remote/entry.schema';

import DatePicker from '$components/date-picker.svelte';
import HoursPicker from '$components/hours-picker.svelte';
import Autocomplete from '$components/autocomplete.svelte';
import { Button } from '$components/ui/button';

let projects = $derived(await getProjects());
</script>

<form class="flex flex-col gap-2" {...addEntry.preflight(schema.entry)}>
	<div class="text-xl font-bold">{m.add_entry_title()}</div>
	<div>
		<DatePicker {...addEntry.fields.date.as('text')} />
	</div>
	<div>
		<HoursPicker {...addEntry.fields.hours.as('number')} onchange={() => addEntry.validate()} />
		{#each addEntry.fields.hours.issues() as issue}
			<div class="text-sm text-red-600">{issue.message}</div>
		{/each}
	</div>
	<div class="max-w-[350px]">
		<Autocomplete
			placeholder="Project"
			options={projects}
			empty={m.project_autocomplete_empty()}
			{...addEntry.fields.project.as('text')} />
	</div>
	<div>
		<Button {...addEntry.buttonProps}>{m.add_entry_button()}</Button>
	</div>
</form>
