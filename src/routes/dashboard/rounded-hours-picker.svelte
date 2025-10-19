<script lang="ts">
let { hours, ...rest } = $props();

import * as m from '$paraglide/messages';

import { Button } from '$components/ui/button';

let value = $state(hours);

let floor = $derived<number>(Math.floor(hours));
let mid = $derived<number>(floor + 0.5);
let ceil = $derived<number>(floor + 1);

function round(t: number) {
	return () => {
		if (value === t) {
			value = hours;
		} else {
			value = t;
		}
	};
}
</script>

<div>
	<div>{m.record_confirm_round()}</div>
	<div class="flex items-center gap-2">
		{#each [floor, mid, ceil].filter(Boolean) as rounded}
			<Button variant={rounded === value ? 'default' : 'outline'} onclick={round(rounded)}>
				{rounded}
			</Button>
		{/each}
	</div>
</div>
<input class="hidden" bind:value {...rest} />
