import { RequestState } from '@/utils/useRecoilRequest';
import { atom } from 'recoil';

export interface Server {
	id: string;
	name: string;
	image: string;
}

export const serversState = atom<RequestState<Server>>({
	key: 'servers',
	default: {
		isFetching: false,
		isFetched: false,
		status: 'pending',
		data: undefined,
		error: undefined,
	},
});
