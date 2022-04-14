export type Arguments<T> = T extends (...args: infer TArgs) => any
	? TArgs
	: never;
