<script lang="ts">
import { SignedIn, SignedOut } from 'svelte-clerk';
import { useClerkContext } from 'svelte-clerk/client';

const ctx = useClerkContext();

async function logout() {
	await ctx.clerk?.signOut();
}
</script>

<div class="flex bg-[#fff1d7] px-4 py-2">
	<div class="flex-auto">
		<a href="/" class="inline-block">
			<img src="/logo.png" alt="Hourglass" class="h-[40px] w-[30px]" />
		</a>
	</div>
	<div class="flex items-center gap-4">
		<SignedIn>
			<button onclick={logout}>Log out</button>
		</SignedIn>
		<SignedOut>
			<a href="/login">Log in</a>
			<a href="/signup">Sign up</a>
		</SignedOut>
	</div>
</div>
