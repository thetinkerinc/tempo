import * as date from 'date-fns';

function getDate(url: URL, name: 'start' | 'end'): Date {
	const dateString = url.searchParams.get(name);
	if (dateString) {
		return new Date(dateString);
	}
	return {
		start: date.startOfMonth(new Date()),
		end: date.endOfMonth(new Date())
	}[name];
}

export default {
	getDate
};
