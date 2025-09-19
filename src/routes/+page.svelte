<script lang="ts">
import { SignedIn, SignedOut } from 'svelte-clerk';

import Dashboard from './dahsboard.svelte';
</script>

<svelte:head>
	<title>Tempo</title>
</svelte:head>
<SignedIn>
	<Dashboard />
</SignedIn>
<SignedOut>
	<div>Tempo</div>
</SignedOut>
