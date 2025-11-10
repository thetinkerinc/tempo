<script lang="ts">
let { initialValue, ...rest }: Props = $props();

import * as date from 'date-fns';

import { parseAbsoluteToLocal, now, getLocalTimeZone } from '@internationalized/date';
import { CalendarDays } from '@lucide/svelte';

import * as Popover from '$components/ui/popover';
import { Button } from '$components/ui/button';
import { Calendar } from '$components/ui/calendar';

import type { DateValue } from '@internationalized/date';

interface Props {
	initialValue?: string;
	name: string;
	type: 'text';
}

let value = $state<string>(initialValue ?? '');
let selectedDate = $state<DateValue>(getInitialValue());

$effect(() => {
	if (!value) {
		const current = now(getLocalTimeZone());
		selectedDate = selectedDate.set({
			hour: current.hour,
			minute: current.minute,
			second: current.second,
			millisecond: current.millisecond
		});
	}
});
$effect(() => {
	value = selectedDate.toDate(getLocalTimeZone()).toISOString();
});

function getInitialValue() {
	if (!value) {
		return now(getLocalTimeZone());
	}
	return parseAbsoluteToLocal(value);
}
</script>

<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button class="flex items-center gap-2" variant="outline" {...props}>
				<CalendarDays />
				<div>{date.format(value || new Date(), 'eee, MMM d')}</div>
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content>
		<Calendar type="single" bind:value={selectedDate} />
	</Popover.Content>
</Popover.Root>
<input class="hidden" bind:value {...rest} />
