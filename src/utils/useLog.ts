export default function useLog(displayName: string) {
	return function (...data: unknown[]) {
		console.log(`%c[${displayName}]`, 'color: gray', ...data);
	};
}
