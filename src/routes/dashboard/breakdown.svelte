<script lang="ts">
import { page } from '$app/state';
import { invalidateAll } from '$app/navigation';
import dayjs from 'dayjs';
import * as _ from 'radashi';

import * as remote from './data.remote';

import { ScrollArea } from '$components/ui/scroll-area';
import * as AlertDialog from '$components/ui/alert-dialog';
import DatePicker from '$components/date-picker.svelte';
import HoursPicker from '$components/hours-picker.svelte';
import Autocomplete from '$components/autocomplete.svelte';

import DateRange from './date-range.svelte';
import CustomDateRange from './custom-date-range.svelte';
import ProjectSelect from './project-select.svelte';

import type { Entry } from '$utils/prisma';
import type { PageData } from './$types';

let editing = $state<boolean>(false);
let id = $state<string>('');
let date = $state<string>('');
let hours = $state<number>(0);
let project = $state<string>();

let data = $derived(page.data as PageData);
let hoursWorked = $derived(_.sum(data.entries, (e) => e.hours));

function edit(entry: Entry) {
	return () => {
		id = entry.id;
		date = entry.date.toISOString();
		hours = entry.hours;
		project = entry.project ?? undefined;
		editing = true;
	};
}

async function save() {
	await remote.updateEntry({
		id,
		data: {
			date,
			hours,
			project
		}
	});
	await invalidateAll();
	editing = false;
}
</script>

<div class="text-xl font-bold">Hours worked: {hoursWorked}</div>
<div class="flex items-center gap-2">
	<div>{dayjs(data.start).format('MMM D, YYYY')}</div>
	<div>-</div>
	<div>{dayjs(data.end).format('MMM D, YYYY')}</div>
</div>
<div class="my-2 flex items-center gap-1">
	<DateRange>Last Month</DateRange>
	<DateRange
		period="this-month"
		start={dayjs().startOf('month').toISOString()}
		end={dayjs().endOf('month').toISOString()}>
		This month
	</DateRange>
	<DateRange
		period="ytd"
		start={dayjs().startOf('year').toISOString()}
		end={dayjs().endOf('year').toISOString()}>
		YTD
	</DateRange>
	<CustomDateRange />
	<ProjectSelect />
</div>
<ScrollArea class="h-[200px]" type="auto">
	{#each data.entries as entry}
		<button
			class="mb-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-1 text-left last:mb-0 hover:bg-gray-100"
			onclick={edit(entry)}>
			<div class="flex items-center gap-4">
				<div>{dayjs(entry.date).format('dddd MMM D')}</div>
				<div>-</div>
				<div>{entry.hours} hour{entry.hours > 1 ? 's' : ''}</div>
			</div>
			<div class="text-gray-500 italic">{entry.project ?? 'No project'}</div>
		</button>
	{/each}
</ScrollArea>
<AlertDialog.Root bind:open={editing}>
	<AlertDialog.Content>
		<div>
			<DatePicker bind:value={date} />
		</div>
		<HoursPicker bind:value={hours} />
		<div class="max-w-[350px]">
			<Autocomplete placeholder="Project" options={data.projects} bind:value={project} />
		</div>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={save}>Save</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
