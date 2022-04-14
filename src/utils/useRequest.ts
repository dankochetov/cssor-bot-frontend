import type { AxiosRequestConfig } from 'axios';
import { useCallback, useRef, useState } from 'react';
import isDeepEqual from 'fast-deep-equal/react';
import produce, { Draft } from 'immer';

import instance from '@/utils/instance';

export type RequestState<T> =
	| {
			isFetching: false;
			isFetched: false;
			status: 'pending';
			data: undefined;
			error: undefined;
	  }
	| {
			isFetching: true;
			isFetched: false;
			status: 'in_progress';
			data: undefined;
			error: undefined;
	  }
	| {
			isFetching: false;
			isFetched: true;
			status: 'success';
			data: T;
			error: undefined;
	  }
	| {
			isFetching: false;
			isFetched: false;
			status: 'error';
			data: undefined;
			error: Error;
	  };

export default function useRequest<T>(config: AxiosRequestConfig): {
	state: RequestState<T>;
	fetch: (config?: AxiosRequestConfig) => void;
	updateState: (
		recipe: (
			draftState: Draft<RequestState<T>>,
		) => Draft<RequestState<T>> | void,
	) => void;
} {
	const [data, setData] = useState<RequestState<T>>({
		isFetching: false,
		isFetched: false,
		status: 'pending',
		data: undefined,
		error: undefined,
	});

	const configRef = useRef(config);
	if (!isDeepEqual(configRef.current, config)) {
		configRef.current = config;
	}

	const fetch = useCallback(
		(config?: AxiosRequestConfig) => {
			setData({
				isFetching: true,
				isFetched: false,
				status: 'in_progress',
				data: undefined,
				error: undefined,
			});

			(async () => {
				const response = await instance.request<T>({
					...configRef.current,
					...(config ?? {}),
				});
				setData({
					isFetching: false,
					isFetched: true,
					status: 'success',
					data: response.data,
					error: undefined,
				});
			})().catch((e: Error) => {
				setData({
					isFetching: false,
					isFetched: false,
					status: 'error',
					data: undefined,
					error: e,
				});
			});
		},
		[setData, configRef.current],
	);

	const updateState = useCallback(
		(
			recipe: (
				draftState: Draft<RequestState<T>>,
			) => Draft<RequestState<T>> | void,
		) => {
			setData(produce(recipe));
		},
		[setData],
	);

	return {
		state: data,
		fetch,
		updateState,
	};
}
