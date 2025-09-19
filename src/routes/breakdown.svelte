<script lang="ts">
import { page } from '$app/state';
import { invalidateAll } from '$app/navigation';
import dayjs from 'dayjs';
import * as _ from 'radashi';

import * as remote from './data.remote';

import * as AlertDialog from '$components/ui/alert-dialog';
import DatePicker from '$components/date-picker.svelte';
import HoursPicker from '$components/hours-picker.svelte';
import { Input } from '$components/ui/input';

import DateRange from './date-range.svelte';
import CustomDateRange from './custom-date-range.svelte';

import type { Entry } from '$utils/prisma';

let editing = $state<boolean>(false);
let id = $state<string>('');
let date = $state<string>('');
let hours = $state<number>(0);
let project = $state<string>();

let data = $derived(page.data);
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
<div>
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
</div>
<div>
	{#each data.entries as entry}
		<button
			class="w-full rounded-lg border border-gray-200 bg-white px-4 py-1 text-left hover:bg-gray-100"
			onclick={edit(entry)}>
			<div class="flex items-center gap-4">
				<div>{dayjs(entry.date).format('dddd MMM D')}</div>
				<div>-</div>
				<div>{entry.hours} hours</div>
			</div>
			<div class="text-gray-500 italic">{entry.project ?? 'No project'}</div>
		</button>
	{/each}
</div>
<AlertDialog.Root bind:open={editing}>
	<AlertDialog.Content>
		<DatePicker bind:value={date} />
		<HoursPicker bind:value={hours} />
		<Input type="text" placeholder="Project" bind:value={project} />
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={save}>Save</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
