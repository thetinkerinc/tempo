<script lang="ts">
import { slide } from 'svelte/transition';
import local from '@thetinkerinc/isolocal';
import * as _ from 'radashi';
import { Pause, Play } from '@lucide/svelte';

import * as remote from './data.remote';

import * as AlertDialog from '$components/ui/alert-dialog';
import { Button } from '$components/ui/button';
import { Input } from '$components/ui/input';

let confirming = $state<boolean>(false);
let recording = $state<boolean>(!!local.sessionStarted);
let paused = $state<boolean>(false);
let elapsed = $state<string>(format(getElapsed()));
let sessionLength = $state<number>(0);
let hours = $state<number>(0);
let project = $state<string>();

$effect(() => {
	const interval = setInterval(() => {
		elapsed = format(getElapsed());
	}, 500);

	return () => {
		clearInterval(interval);
	};
});

function startSession() {
	if (recording) {
		return;
	}
	local.sessionStarted = Date.now();
	recording = true;
}

function togglePaused() {
	if (!recording) {
		return;
	}
	local.sessionPauses = [...local.sessionPauses, Date.now()];
	paused = !paused;
}

function finishSession() {
	if (!recording) {
		return;
	}
	sessionLength = _.round(getElapsed() / (60 * 60 * 1000), 3);
	hours = sessionLength;
	confirming = true;
	recording = false;
	paused = false;
}

function getElapsed() {
	if (!recording) {
		return 0;
	}
	const pauses = _.cluster(local.sessionPauses, 2);
	if ((pauses as [number, number?][]).at(-1)?.length === 1) {
		pauses.at(-1)?.push(Date.now());
	}
	const timePaused = pauses.reduce((a, v) => a + (v[1] - v[0]), 0);
	return Date.now() - (local.sessionStarted ?? 0) - timePaused;
}

function format(duration: number): string {
	let time = duration / (60 * 60 * 1000);
	const hours = Math.floor(time);
	time = (time - hours) * 60;
	const minutes = Math.floor(time);
	const seconds = Math.floor((time - minutes) * 60);
	return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function pad(num: number) {
	return num.toString().padStart(2, '0');
}

function round(t: number) {
	return () => {
		if (hours === t) {
			hours = sessionLength;
		} else {
			hours = t;
		}
	};
}

async function save() {
	await remote.addEntry({
		date: new Date().toISOString(),
		hours,
		project
	});
	clear();
}

function clear() {
	local.clear();
	sessionLength = 0;
	hours = 0;
	project = undefined;
	confirming = false;
}
</script>

<div class="fixed right-10 bottom-10 rounded-full bg-beige px-4 py-2 shadow-md">
	<div class={['flex items-center gap-4', recording && 'pt-2']}>
		<button
			class="size-[29px] cursor-pointer rounded-full border border-black bg-red-500"
			aria-label="Start a session"
			onclick={startSession}></button>
		<button class="cursor-pointer" onclick={togglePaused}>
			{#if paused}
				<Play size={30} strokeWidth={1} absoluteStrokeWidth={true} class="fill-black" />
			{:else}
				<Pause size={30} strokeWidth={1} absoluteStrokeWidth={true} class="fill-black" />
			{/if}
		</button>
		<button
			class="size-[25px] cursor-pointer rounded bg-black"
			aria-label="Finish current session"
			onclick={finishSession}></button>
	</div>
	{#if recording}
		<div class="mt-1 text-center font-bold" transition:slide>
			{elapsed}
		</div>
	{/if}
</div>
<AlertDialog.Root bind:open={confirming}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				You worked {sessionLength} hours
			</AlertDialog.Title>
		</AlertDialog.Header>
		{@const floor = Math.floor(sessionLength)}
		{@const mid = floor + 0.5}
		{@const ceil = floor + 1}
		<div>
			<div>Round your session?</div>
			<div class="flex items-center gap-2">
				{#each [floor, mid, ceil].filter((n) => n > 0) as rounded}
					<Button
						class={[rounded === hours && 'bg-black text-white hover:bg-black hover:text-white']}
						variant="outline"
						onclick={round(rounded)}>
						{rounded}
					</Button>
				{/each}
			</div>
		</div>
		<div>
			<label for="project">Save session to a project?</label>
			<Input id="project" type="text" bind:value={project} />
		</div>
		<AlertDialog.Footer>
			<AlertDialog.Cancel onclick={clear}>Discard</AlertDialog.Cancel>
			<AlertDialog.Action onclick={save}>Save</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
