<script lang="ts">
let { value = $bindable() } = $props();

import { Button } from '$components/ui/button';
</script>

<div class="flex max-w-[250px] items-center gap-1 overflow-x-auto scrollbar-none">
	{#each { length: 12 }, h}
		<Button
			class={[value === h + 1 && 'bg-black text-white hover:bg-black hover:text-white']}
			variant="outline"
			onclick={() => (value = h + 1)}>
			{h + 1}
		</Button>
	{/each}
</div>
