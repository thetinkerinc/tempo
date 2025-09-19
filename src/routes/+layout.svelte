<script lang="ts">
import { ClerkProvider } from 'svelte-clerk';

import Header from './header.svelte';

import '../app.css';

let { children } = $props();
</script>

<ClerkProvider>
	<Header />
	{@render children?.()}
</ClerkProvider>
