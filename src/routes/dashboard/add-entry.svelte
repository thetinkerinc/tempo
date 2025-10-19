<script lang="ts">
import * as m from '$paraglide/messages';
import { getProjects, addEntry } from './data.remote';
import schema from './schema';

import DatePicker from '$components/date-picker.svelte';
import HoursPicker from '$components/hours-picker.svelte';
import Autocomplete from '$components/autocomplete.svelte';
import { Button } from '$components/ui/button';
</script>

{@render content()}
{#snippet content()}
	{@const form = addEntry}
	<form class="flex flex-col gap-2" {...form.preflight(schema.entry)}>
		<div class="text-xl font-bold">{m.add_entry_title()}</div>
		<div>
			<DatePicker {...form.fields.date.as('text')} />
		</div>
		<div>
			<HoursPicker {...form.fields.hours.as('number')} onchange={() => form.validate()} />
			{#each form.fields.hours.issues() as issue}
				<div class="text-sm text-red-600">{issue.message}</div>
			{/each}
		</div>
		<div class="max-w-[350px]">
			<Autocomplete
				placeholder="Project"
				options={await getProjects()}
				{...form.fields.project.as('text')} />
		</div>
		<div>
			<Button {...form.buttonProps}>{m.add_entry_button()}</Button>
		</div>
	</form>
{/snippet}
