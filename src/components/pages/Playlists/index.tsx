import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons/faYoutube';
import { faSpotify } from '@fortawesome/free-brands-svg-icons/faSpotify';
import { Scrollbars } from 'react-custom-scrollbars';
import { Link, useHistory } from 'react-router-dom';
import { useMount, usePreviousDistinct } from 'react-use';
import produce from 'immer';

import Constants from '@/schema/constants';
import Icon from '@/components/common/Icon';
import LongText from '@/components/common/LongText';
import Colors from '@/schema/colors';
import Animation from '@/schema/animation';
import CollapsableInput from '@/components/common/CollapsableInput';
import useRecoilRequest from '@/utils/useRecoilRequest';
import { Playlist, playlistsState } from '@/state/playlists';
import useRequest from '@/utils/useRequest';

const Playlists: FC = () => {
	const history = useHistory();

	const [newPlaylistName, setNewPlaylistName] = useState('');
	const [playlistsFilter, setPlaylistsFilter] = useState('');

	const { state: playlists, fetch: fetchPlaylists } = useRecoilRequest(
		{
			url: '/playlists',
			method: 'get',
		},
		playlistsState,
	);

	const { state: createPlaylistState, fetch: fetchCreatePlaylist } =
		useRequest<{ playlist: Playlist }>({
			url: '/playlists',
			method: 'post',
		});
	const createPlaylistFetchedPrev = usePreviousDistinct(
		createPlaylistState.isFetched,
	);

	const handleNewPlaylistCreate = useCallback(() => {
		if (!newPlaylistName.trim()) return;
		fetchCreatePlaylist({ data: { name: newPlaylistName } });
	}, [fetchCreatePlaylist, newPlaylistName]);

	const filteredPlaylists = useMemo(() => {
		return produce(playlists, (p) => {
			if (p.data) {
				p.data.playlists = p.data.playlists.filter((pl) =>
					pl.name.includes(playlistsFilter),
				);
			}
		});
	}, [playlists, playlistsFilter]);

	useMount(() => {
		if (playlists.status !== 'success' && playlists.status !== 'in_progress') {
			fetchPlaylists();
		}
	});

	useEffect(() => {
		if (createPlaylistFetchedPrev !== undefined && !createPlaylistFetchedPrev) {
			history.push(`/playlist/${createPlaylistState.data!.playlist.id}`);
		}
	}, [createPlaylistFetchedPrev]);

	return (
		<Root>
			<Header>
				Playlists
				<HeaderInput
					icon={<Icon size={36}>add</Icon>}
					width={300}
					title='New playlist'
					placeholder='New playlist name'
					value={newPlaylistName}
					onChange={setNewPlaylistName}
					onEnter={handleNewPlaylistCreate}
				/>
				<HeaderInput
					width={250}
					icon={
						<Icon size={30} round>
							filter_alt
						</Icon>
					}
					title='Filter playlists'
					placeholder='Filter playlists...'
					value={playlistsFilter}
					onChange={setPlaylistsFilter}
				/>
			</Header>
			{!!filteredPlaylists.error && 'Unable to fetch playlists'}
			<PlaylistsList
				renderThumbVertical={({ style, ...props }) => (
					<div
						{...props}
						style={{
							...style,
							backgroundColor: 'rgba(255, 255, 255, 0.2)',
							cursor: 'pointer',
							borderRadius: 'inherit',
						}}
					/>
				)}
			>
				{filteredPlaylists.isFetched &&
					filteredPlaylists.data.playlists.map((p) => (
						<PlaylistView to={`/playlist/${p.id}`} key={p.id}>
							<PlaylistCover>
								{p.cover ? (
									<PlaylistCoverImage src={p.cover} />
								) : (
									<PlaylistIcon size={90}>queue_music</PlaylistIcon>
								)}
							</PlaylistCover>
							<PlaylistTitle>
								{p.source &&
									(() => {
										switch (p.source) {
											case 'youtube':
												return (
													<PlaylistTitleIcon
														icon={faYoutube}
														title='Imported from YouTube'
													/>
												);
											case 'spotify':
												return (
													<PlaylistTitleIcon
														icon={faSpotify}
														title='Imported from Spotify'
													/>
												);
										}
									})()}
								<PlaylistTitleText maxWidth={p.source ? 125 : 150}>
									{p.name}
								</PlaylistTitleText>
							</PlaylistTitle>
						</PlaylistView>
					))}
			</PlaylistsList>
		</Root>
	);
};

export default Playlists;

const Root = styled.div`
	display: flex;
	flex-flow: column nowrap;
	flex: 1;
`;

const Header = styled.h1`
	min-height: 50px;
	margin-top: 10px;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
`;

const HeaderInput = styled(CollapsableInput)`
	margin-left: 5px;
`;

const PlaylistsList = styled(Scrollbars)`
	margin-bottom: 10px;
	margin-left: -25px;
	height: auto !important;
	flex: 1;

	> div {
		display: flex;
		flex-flow: row wrap;
		align-content: start;
		row-gap: 25px;
		margin-top: 25px;
	}
`;

const PlaylistIcon = styled(Icon)`
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
`;

const PlaylistView = styled(Link)`
	display: flex;
	flex-flow: column nowrap;
	margin-left: 25px;
	transition: background-color ${Animation.durationMs}ms;
	padding: 15px;
	background-color: #232323;
	border-radius: ${Constants.borderRadius}px;

	&:hover {
		cursor: pointer;
		background-color: ${Colors.backgroundMedium};

		${PlaylistIcon} {
			color: white;
		}
	}
`;

const PlaylistCover = styled.div`
	width: 150px;
	height: 150px;
	border-radius: ${Constants.borderRadius}px;
	position: relative;
	overflow: hidden;
`;

const PlaylistCoverImage = styled.img`
	position: absolute;
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

const PlaylistTitle = styled.div`
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	margin-top: 20px;
	font-size: 10pt;
	font-weight: 400;
`;

const PlaylistTitleIcon = styled(FontAwesomeIcon)`
	margin-right: 0.5em;
`;

const PlaylistTitleText = styled(LongText)``;
