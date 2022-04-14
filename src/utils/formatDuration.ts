import formatDuration from 'format-duration';

export default function (duration: number): string {
	return formatDuration(duration * 1000);
}
