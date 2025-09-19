<script lang="ts">
import { page } from '$app/state';
import { goto } from '$app/navigation';
import { getLocalTimeZone } from '@internationalized/date';

import * as Popover from '$components/ui/popover';
import { RangeCalendar } from '$components/ui/range-calendar';
import { Button } from '$components/ui/button';

import type { DateRange } from 'bits-ui';

let selectedPeriod = $derived(page.url.searchParams.get('period'));
let variant = $derived(selectedPeriod === 'custom' ? 'default' : 'outline');

function setDateRange(range: DateRange) {
	if (!range.start || !range.end) {
		return;
	}
	const start = range.start.toDate(getLocalTimeZone()).toISOString();
	const end = range.end.toDate(getLocalTimeZone()).toISOString();
	goto(`/?period=custom&start=${start}&end=${end}`);
}
</script>

<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button {variant} {...props}>Custom</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0">
		<RangeCalendar numberOfMonths={2} onValueChange={setDateRange} />
	</Popover.Content>
</Popover.Root>
