<script lang="ts">
import { ClerkProvider } from 'svelte-clerk';
import { setDefaultOptions } from 'date-fns';
import { enUS as clerkEn, esMX as clerkEs } from '@clerk/localizations';
import { enUS as dateEn, es as dateEs } from 'date-fns/locale';
import { getLocale } from '$paraglide/runtime';

import { Toaster } from '$components/ui/sonner';

import Header from './header.svelte';
import Metaballs from './metaballs.svelte';

import '../app.css';

let { children } = $props();

setDefaultOptions({
	locale: {
		en: dateEn,
		es: dateEs
	}[getLocale()]
});
const clerkLocale = {
	en: clerkEn,
	es: clerkEs
}[getLocale()];
</script>

<Toaster position="top-right" richColors closeButton />
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
