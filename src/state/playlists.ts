import { atom } from 'recoil';

import { RequestState } from '@/utils/useRecoilRequest';

export interface Playlist {
	id: string;
	name: string;
	cover: string | null;
	source: 'spotify' | 'youtube' | null;
	sourceUrl: string | null;
	createdBy: string;
	items?: PlaylistItem[];
}

export interface PlaylistItem {
	id: string;
	title: string;
	cover: string | null;
}

export const playlistsState = atom<RequestState<{ playlists: Playlist[] }>>({
	key: 'playlists',
	default: {
		isFetching: false,
		isFetched: false,
		status: 'pending',
		data: undefined,
		error: undefined,
	},
});
