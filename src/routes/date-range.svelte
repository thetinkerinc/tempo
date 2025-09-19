<script lang="ts">
let { period, start, end, children }: Props = $props();

import { page } from '$app/state';
import * as _ from 'radashi';

import { Button } from '$components/ui/button';

import type { Snippet } from 'svelte';

interface Props {
	period?: string;
	start?: string;
	end?: string;
	children: Snippet;
}

let selectedPeriod = $derived(page.url.searchParams.get('period'));
let variant = $derived<'default' | 'outline'>(selectedPeriod == period ? 'default' : 'outline');
let href = $derived(makeHref());

function makeHref() {
	const q = new URLSearchParams(
		_.shake({
			period,
			start,
			end
		})
	).toString();
	if (q) {
		return '/?' + q;
	}
	return '/';
}
</script>

<Button {variant} {href}>
	{@render children()}
</Button>
