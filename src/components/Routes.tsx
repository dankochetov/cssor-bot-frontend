import { Redirect, Route, Switch } from 'react-router-dom';
import { FC } from 'react';

import Playlists from '@/components/pages/Playlists';
import Playlist from '@/components/pages/Playlist';

const Routes: FC = () => {
	return (
		<Switch>
			<Route exact path='/playlist/:id'>
				<Playlist />
			</Route>

			<Route exact path='/'>
				<Playlists />
			</Route>

			<Redirect to='/' />
		</Switch>
	);
};

export default Routes;
