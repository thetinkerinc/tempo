import { page } from '$app/state';
import { goto } from '$app/navigation';

async function updateSearch(params: { [key: string]: string | undefined }) {
	const path = page.url.pathname;
	const currentParams = page.url.searchParams;
	Object.entries(params).forEach(([k, v]) => {
		if (v) {
			currentParams.set(k, v);
		} else {
			currentParams.delete(k);
		}
	});
	let query = currentParams.toString();
	if (query) {
		query = '?' + query;
	}
	await goto(`${path}${query}`, {
		invalidateAll: true,
		replaceState: true
	});
}

export default {
	updateSearch
};
