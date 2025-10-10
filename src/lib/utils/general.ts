import dayjs from 'dayjs';

function getDate(url: URL, name: 'start' | 'end'): Date {
	const dateString = url.searchParams.get(name);
	if (dateString) {
		return new Date(dateString);
	}
	return {
		start: dayjs().startOf('month').toDate(),
		end: dayjs().endOf('month').toDate()
	}[name];
}

export default {
	getDate
};
