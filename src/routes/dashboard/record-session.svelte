<script lang="ts">
import { slide } from 'svelte/transition';
import local from '@thetinkerinc/isolocal';
import { toast } from 'svelte-sonner';
import * as _ from 'radashi';
import { Pause, Play } from '@lucide/svelte';

import * as m from '$paraglide/messages';
import { getProjects, addEntry } from './data.remote';
import schema from './schema';

import * as AlertDialog from '$components/ui/alert-dialog';
import Autocomplete from '$components/autocomplete.svelte';

import RoundedHoursPicker from './rounded-hours-picker.svelte';

let confirming = $state<boolean>(false);
let recording = $state<boolean>(!!local.sessionStarted);
let paused = $state<boolean>(false);
let elapsed = $state<string>(format(getElapsed()));
let sessionLength = $state<number>(0);

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

async function enhance({ form, submit }: AddEntryEnhanceParams) {
	try {
		await submit();
		form.reset();
		clear();
	} catch (_err) {
		toast.error(m.record_save_error());
	}
}

function clear() {
	local.clear();
	sessionLength = 0;
	confirming = false;
}
</script>

<div class="fixed right-10 bottom-10 rounded-full bg-beige px-4 py-2 shadow-md">
	<div class={['flex items-center gap-4', recording && 'pt-2']}>
		<button
			class={[
				'size-[29px] cursor-pointer rounded-full border border-black bg-red-500',
				recording && 'animate-pulse'
			]}
			aria-label={m.record_start_label()}
			onclick={startSession}></button>
		<button
			class={['cursor-pointer transition', !recording && 'opacity-40']}
			onclick={togglePaused}>
			{#if paused}
				<Play size={30} strokeWidth={1} absoluteStrokeWidth={true} class="fill-black" />
			{:else}
				<Pause size={30} strokeWidth={1} absoluteStrokeWidth={true} class="fill-black" />
			{/if}
		</button>
		<button
			class={['size-[25px] cursor-pointer rounded bg-black transition', !recording && 'opacity-40']}
			aria-label={m.record_stop_label()}
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
				{m.record_confirm_title({ sessionLength })}
			</AlertDialog.Title>
		</AlertDialog.Header>
		{@const form = addEntry.for('add-recorded-session')}
		<form
			id="add-recorded-session"
			class="flex flex-col gap-2"
			{...form.preflight(schema.entry).enhance(enhance)}>
			<input class="hidden" {...form.fields.date.as('text')} value={new Date().toISOString()} />
			<RoundedHoursPicker hours={sessionLength} {...form.fields.hours.as('number')} />
			<div>
				<label for="project">{m.record_confirm_project()}</label>
				<Autocomplete
					placeholder="Project"
					options={await getProjects()}
					{...form.fields.project.as('text')} />
			</div>
		</form>
		<AlertDialog.Footer>
			<AlertDialog.Cancel onclick={clear}>{m.record_confirm_discard()}</AlertDialog.Cancel>
			<AlertDialog.Action {...form.buttonProps.enhance(enhance)} form="add-recorded-session"
				>{m.record_confirm_save()}</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
