<script lang="ts">
import { Show } from 'svelte-clerk';
import { useClerkContext } from 'svelte-clerk/client';
import { resolve } from '$app/paths';
import { Earth } from '@lucide/svelte';

import * as m from '$paraglide/messages';
import { getLocale, setLocale, locales } from '$paraglide/runtime';

import * as Select from '$components/ui/select';
import { Button } from '$components/ui/button';

import type { Locale } from '$paraglide/runtime';

const ctx = useClerkContext();

async function logout() {
	await ctx.clerk?.signOut();
}
</script>

<div class="flex items-center border-b border-black bg-beige px-4 py-2">
	<div class="flex-auto">
		<a href={resolve(ctx.auth.userId ? '/dashboard' : '/')} class="inline-block">
			<img src="/logo.png" alt="Hourglass" class="h-[40px] w-[30px]" />
		</a>
	</div>
	<div class="flex items-center gap-4 font-bold">
		<Show when="signed-in">
			<button class="cursor-pointer hover:underline" onclick={logout}>{m.header_logout()}</button>
		</Show>
		<Show when="signed-out">
			<a class="hover:underline" href={resolve('/login')}>{m.header_login()}</a>
			<a class="hover:underline" href={resolve('/signup')}>{m.header_signup()}</a>
		</Show>
		<Select.Root type="single" value={getLocale()} onValueChange={(l) => setLocale(l as Locale)}>
			<Select.Trigger>
				{#snippet child({ props })}
					<Button
						variant="ghost"
						{...props}
						class="border-none p-0! hover:cursor-pointer hover:bg-transparent">
						<Earth class="size-[20px] text-black" />
					</Button>
				{/snippet}
			</Select.Trigger>
			<Select.Content>
				{#each locales as l}
					<Select.Item value={l}>{l}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>
</div>
