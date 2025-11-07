import { startOfMonth, endOfMonth } from 'date-fns';

function getDate(url: URL, name: 'start' | 'end'): Date {
	const dateString = url.searchParams.get(name);
	if (dateString) {
		return new Date(dateString);
	}
	return {
		start: startOfMonth(new Date()),
		end: endOfMonth(new Date())
	}[name];
}

export default {
	getDate
};
