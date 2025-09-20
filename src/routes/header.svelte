<script lang="ts">
import { SignedIn, SignedOut } from 'svelte-clerk';
import { useClerkContext } from 'svelte-clerk/client';

const ctx = useClerkContext();

async function logout() {
	await ctx.clerk?.signOut();
}
</script>

<div class="flex bg-beige px-4 py-2">
	<div class="flex-auto">
		<a href={ctx.auth.userId ? '/dashboard' : '/'} class="inline-block">
			<img src="/logo.png" alt="Hourglass" class="h-[40px] w-[30px]" />
		</a>
	</div>
	<div class="flex items-center gap-4 font-bold">
		<SignedIn>
			<button class="cursor-pointer hover:underline" onclick={logout}>Log out</button>
		</SignedIn>
		<SignedOut>
			<a class="hover:underline" href="/login">Log in</a>
			<a class="hover:underline" href="/signup">Sign up</a>
		</SignedOut>
	</div>
</div>
