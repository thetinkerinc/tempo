<script lang="ts">
import { ClerkProvider } from 'svelte-clerk';
import { enUS, esMX } from '@clerk/localizations';
import { getLocale } from '$paraglide/runtime';

import Header from './header.svelte';
import Metaballs from './metaballs.svelte';

import '../app.css';

let { children } = $props();

const clerkLocale = {
	en: enUS,
	es: esMX
}[getLocale()];
</script>

<ClerkProvider localization={clerkLocale}>
	<div class="grid min-h-[100dvh] grid-rows-[auto_1fr]">
		<Header />
		<div id="bg" class="bg-linear-160 from-[#ffd3ac] to-[#ff8559] px-3 py-10">
			<Metaballs />
			<div class="relative">
				{@render children?.()}
			</div>
		</div>
	</div>
</ClerkProvider>
