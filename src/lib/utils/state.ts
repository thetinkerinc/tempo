import { page } from '$app/state';

import utils from './general';

function qp() {
	return {
		start: utils.getDate(page.url, 'start').toISOString(),
		end: utils.getDate(page.url, 'end').toISOString(),
		project: page.url.searchParams.get('project')
	};
}

export { qp };
