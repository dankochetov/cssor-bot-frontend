import useWebSocketOriginal, {
	Options as OptionsOriginal,
} from 'react-use-websocket';
import type { WebSocketHook } from 'react-use-websocket/dist/lib/types';
import { useCallback, useEffect, useState } from 'react';

import type { Playlist, PlaylistItem } from '@/state/playlists';
import { Arguments } from '@/utils/arguments';
import {
	getJWT,
	redirectToLoginPage,
	RedirectToLoginPageError,
	refreshToken,
} from './auth';
import { useMount } from 'react-use';
import moment from 'moment';
import useRequest from './useRequest';
import instance from './instance';

export interface QueueChangedEvent {
	type: 'queueChanged';
	queue: {
		title: string;
		duration: number;
		cover: string | null;
	}[];
}

export interface PlaylistsChangedEvent {
	type: 'playlistsChanged';
	playlists: Playlist[];
}

export interface PlaylistItemsChangedEvent {
	type: 'playlistItemsChanged';
	playlistId: string;
	playlistItems: PlaylistItem[];
}

export type WebSocketsEvent =
	| QueueChangedEvent
	| PlaylistsChangedEvent
	| PlaylistItemsChangedEvent;

type Options<
	TEventType extends WebSocketsEvent['type'],
	TEvent extends WebSocketsEvent,
> = OptionsOriginal & {
	events?: {
		type: TEventType;
		onEvent: (e: TEvent extends { type: TEventType } ? TEvent : never) => void;
	};
};

export default function useWebSocket<
	TEventType extends WebSocketsEvent['type'],
	TEvent extends WebSocketsEvent,
>(options: Options<TEventType, TEvent> = {}): WebSocketHook {
	const {
		events,
		onMessage: _onMessage,
		onError: _onError,
		...otherOptions
	} = options;

	const [shouldConnect, setShouldConnect] = useState(false);

	const onMessage = useCallback(
		(e: WebSocketEventMap['message']) => {
			if (!events) {
				onMessage?.(e);
				return;
			}

			if (typeof e.data !== 'string') {
				console.warn(
					`received unsupported WS payload of type ${typeof e.data}`,
				);
				return;
			}

			const data = JSON.parse(e.data) as WebSocketsEvent;
			const eventTypes: WebSocketsEvent['type'][] =
				typeof events.type === 'string' ? [events.type] : events.type;
			if (eventTypes.includes(data.type)) {
				events.onEvent(data as Arguments<typeof events.onEvent>[0]);
			}
		},
		[events, events?.type, events?.onEvent, _onMessage],
	);

	const onError = useCallback((e: WebSocketEventMap['error']) => {
		_onError?.(e);
		console.error(e);
		redirectToLoginPage();
	}, []);

	useMount(() => {
		(async () => {
			const tokens = getJWT();
			if (!tokens) {
				redirectToLoginPage();
			}

			if (moment.unix(tokens.expiresAt).isSameOrBefore()) {
				await refreshToken();
			}

			setShouldConnect(true);
		})().catch((e) => {
			console.error(e);
			if (e instanceof RedirectToLoginPageError) {
				return;
			}
			redirectToLoginPage();
		});
	});

	useEffect(() => {});

	return useWebSocketOriginal(
		import.meta.env.VITE_APP_WS_API_HOST,
		{
			share: true,
			...otherOptions,
			onMessage,
			onError,
			queryParams: {
				Authorization: getJWT()!.idToken,
			},
		},
		shouldConnect,
	);
}
