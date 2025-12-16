<script lang="ts">
import { flip } from 'svelte/animate';
import { page } from '$app/state';
import * as date from 'date-fns';
import { toast } from 'svelte-sonner';
import * as _ from 'radashi';

import utils from '$utils/general';

import * as m from '$paraglide/messages';
import { getEntries, getProjects, updateEntry, deleteEntry } from '$remote/entry.remote';
import schema from '$remote/entry.schema';

import { ScrollArea } from '$components/ui/scroll-area';
import * as AlertDialog from '$components/ui/alert-dialog';
import DatePicker from '$components/date-picker.svelte';
import HoursPicker from '$components/hours-picker.svelte';
import Autocomplete from '$components/autocomplete.svelte';
import { Button } from '$components/ui/button';

import DateRange from './date-range.svelte';
import CustomDateRange from './custom-date-range.svelte';
import ProjectSelect from './project-select.svelte';

import type { Entry } from '$utils/db';

let editing = $state<boolean>(false);
let entry = $state<Entry>();

let entries = $derived(await getEntries());
let projects = $derived(await getProjects());
let start = $derived(utils.getDate(page.url, 'start'));
let end = $derived(utils.getDate(page.url, 'end'));
let hoursWorked = $derived(_.sum(entries, (e) => e.hours));
let maxHoursWorked = $derived(_.max(entries, (e) => e.hours)?.hours);

function edit(e: Entry) {
	return () => {
		entry = e;
		editing = true;
	};
}

async function enhance({ form, submit }: UpdateEntryEnhanceParams | DeleteEntryEnhanceParams) {
	try {
		await submit();
		form.reset();
		editing = false;
		entry = undefined;
	} catch (_err) {
		toast.error(m.breakdown_edit_error());
	}
}
</script>

<div class="text-xl font-bold">{m.breakdown_hours_worked()}: {hoursWorked}</div>
<div class="flex items-center gap-2">
	<div>{date.format(start, 'MMM d, yyyy')}</div>
	<div>-</div>
	<div>{date.format(end, 'MMM d, yyyy')}</div>
</div>
<div class="my-2 flex flex-wrap items-center gap-1">
	<DateRange>
		{m.breakdown_this_month()}
	</DateRange>
	<DateRange
		period="last-month"
		start={date.startOfMonth(date.subMonths(new Date(), 1)).toISOString()}
		end={date.endOfMonth(date.subMonths(new Date(), 1)).toISOString()}>
		{m.breakdown_last_month()}
	</DateRange>
	<DateRange
		period="ytd"
		start={date.startOfYear(new Date()).toISOString()}
		end={date.endOfYear(new Date()).toISOString()}>
		{m.breakdown_ytd()}
	</DateRange>
	<CustomDateRange />
	<ProjectSelect />
</div>
<ScrollArea type="auto">
	<div class="max-h-[300px]">
		{#each entries as entry (entry.id)}
			{@const width = maxHoursWorked ? Math.round((entry.hours / maxHoursWorked) * 100) : 1}
			{@const stop = Math.round(10000 / width)}
			<button
				class="mb-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-1 text-left last:mb-0 hover:bg-gray-100"
				onclick={edit(entry)}
				animate:flip={{ duration: 200 }}>
				<div class="grid grid-cols-[auto_1fr] gap-6">
					<div>
						<div class="flex items-center gap-4">
							<div>{date.format(entry.date, 'eeee, MMM d')}</div>
							<div>-</div>
							<div>{m.breakdown_entry_hours({ hours: entry.hours })}</div>
						</div>
						<div class="text-gray-500 italic">
							{entry.project ?? m.breakdown_entry_no_project()}
						</div>
					</div>
					<div
						class="h-4 self-center justify-self-end rounded shadow transition-[width]"
						style="width: {width}%; background: linear-gradient(to left, #ff8559, #ffd3ac {stop}%)">
					</div>
				</div>
			</button>
		{/each}
	</div>
</ScrollArea>
<AlertDialog.Root bind:open={editing}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				{m.breakdown_edit_title()}
			</AlertDialog.Title>
		</AlertDialog.Header>
		<form
			id="update-entry"
			class="flex flex-col gap-2"
			{...updateEntry.preflight(schema.updateEntry).enhance(enhance)}>
			<input class="hidden" {...updateEntry.fields.id.as('text')} value={entry?.id} />
			<div>
				<DatePicker
					initialValue={entry?.date?.toISOString?.()}
					{...updateEntry.fields.data.date.as('text')} />
			</div>
			<HoursPicker initialValue={entry?.hours} {...updateEntry.fields.data.hours.as('number')} />
			<div class="max-w-[350px]">
				<Autocomplete
					placeholder={m.project_select_placeholder()}
					options={projects}
					initialValue={entry?.project}
					empty={m.project_autocomplete_empty()}
					{...updateEntry.fields.data.project.as('text')} />
			</div>
		</form>
		<form id="delete-entry" class="hidden" {...deleteEntry.enhance(enhance)}>
			<input {...deleteEntry.fields.id.as('text')} value={entry?.id} />
		</form>
		<AlertDialog.Footer>
			<div class="flex-auto">
				<Button
					variant="destructive"
					form="delete-entry"
					{...deleteEntry.buttonProps.enhance(enhance)}>
					Delete
				</Button>
			</div>
			<AlertDialog.Cancel>{m.breakdown_edit_cancel()}</AlertDialog.Cancel>
			<AlertDialog.Action form="update-entry" {...updateEntry.buttonProps.enhance(enhance)}>
				{m.breakdown_edit_save()}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
