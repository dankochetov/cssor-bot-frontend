import { FC } from 'react';

import PlaylistsListener from '@/components/ws-listeners/PlaylistsListener';

const GlobalWebSocketsListener: FC = () => {
	return (
		<>
			<PlaylistsListener />
		</>
	);
};

export default GlobalWebSocketsListener;
