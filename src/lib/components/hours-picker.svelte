<script lang="ts">
let { value = $bindable() } = $props();

import { Button } from '$components/ui/button';

let hasHalfSelected = $state<boolean>(false);

function isHourSelected(h: number) {
	return value === h || value === h + 0.5;
}

function handleHour(h: number) {
	return () => {
		value = h + +hasHalfSelected * 0.5;
	};
}

function handleHalf() {
	if (hasHalfSelected) {
		value -= 0.5;
		hasHalfSelected = false;
	} else {
		value += 0.5;
		hasHalfSelected = true;
	}
}
</script>

<div class="flex items-center gap-3">
	<div class="flex max-w-[250px] items-center gap-1 overflow-x-auto scrollbar-none">
		{#each { length: 12 }, h}
			{@const hour = h + 1}
			<Button variant={isHourSelected(hour) ? 'default' : 'outline'} onclick={handleHour(hour)}>
				{hour}
			</Button>
		{/each}
	</div>
	<Button variant={hasHalfSelected ? 'default' : 'outline'} onclick={handleHalf}>+.5</Button>
</div>
