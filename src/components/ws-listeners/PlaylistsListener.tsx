import { FC, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import produce from 'immer';

import { playlistsState } from '@/state/playlists';
import useWebSocket, {
	PlaylistItemsChangedEvent,
	PlaylistsChangedEvent,
} from '@/utils/useWebSocket';

const PlaylistsListener: FC = () => {
	const [, updatePlaylistsState] = useRecoilState(playlistsState);

	const handlePlaylistsChanged = useCallback(
		(e: PlaylistsChangedEvent) => {
			updatePlaylistsState((playlists) =>
				produce(playlists, (draft) => {
					draft.isFetching = false;
					draft.isFetched = true;
					draft.error = undefined;
					draft.data = {
						playlists: e.playlists,
					};
				}),
			);
		},
		[updatePlaylistsState],
	);

	const handlePlaylistItemsChanged = useCallback(
		(e: PlaylistItemsChangedEvent) => {
			updatePlaylistsState((playlists) =>
				produce(playlists, (draft) => {
					if (draft.status !== 'success') return;

					const playlist = draft.data.playlists.find(
						(p) => p.id === e.playlistId,
					);
					if (playlist) {
						playlist.items = e.playlistItems;
					}
				}),
			);
		},
		[updatePlaylistsState],
	);

	useWebSocket({
		events: {
			type: 'playlistsChanged',
			onEvent: handlePlaylistsChanged,
		},
	});

	useWebSocket({
		events: {
			type: 'playlistItemsChanged',
			onEvent: handlePlaylistItemsChanged,
		},
	});

	return null;
};

export default PlaylistsListener;
