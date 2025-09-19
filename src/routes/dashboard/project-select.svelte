<script lang="ts">
import { page } from '$app/state';

import navigation from '$utils/navigation';

import * as Select from '$components/ui/select';

let open = $state<boolean>(false);
let value = $state<string | undefined>(page.url.searchParams.get('project') ?? undefined);

async function handleProject(project: string) {
	open = false;
	await navigation.updateSearch({
		project
	});
}
</script>

<Select.Root type="single" allowDeselect={true} onValueChange={handleProject} bind:open bind:value>
	<Select.Trigger>
		{value || 'Project'}
	</Select.Trigger>
	<Select.Content>
		{#each page.data.projects as project}
			<Select.Item value={project}>{project}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
