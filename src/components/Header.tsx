import { useCallback, useEffect, useMemo, useState } from 'react';
import { FC } from 'react';
import styled, { css } from 'styled-components/macro';
import { usePreviousDistinct } from 'react-use';

import Input from './common/Input';
import Icon from './common/Icon';
import Colors from '../schema/colors';
import Animation from '../schema/animation';
import useRequest from '@/utils/useRequest';
import Track from '@/components/common/Track';
import Playlist from '@/components/common/Playlist';
import useRecoilRequest from '@/utils/useRecoilRequest';
import { serversState } from '@/state/servers';

const LOOKUP_RESULT_TRACK =
	'com.cssorbot.api.routes.lookup.Response.Result.Track';

const LOOKUP_RESULT_PLAYLIST =
	'com.cssorbot.api.routes.lookup.Response.Result.Playlist';

interface LookupResultTrack {
	type: typeof LOOKUP_RESULT_TRACK;
	title: string;
	cover: string | null;
	duration: number;
}

interface LookupResultPlaylist {
	type: typeof LOOKUP_RESULT_PLAYLIST;
	name: string;
	cover: string | null;
	size: number;
	tracks: LookupResultTrack[];
}

type LookupResult = LookupResultTrack | LookupResultPlaylist | null;

const Header: FC = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const searchQueryPrev = usePreviousDistinct(searchQuery);

	const {
		state: lookupResults,
		fetch: fetchLookup,
		updateState: updateLookupResults,
	} = useRequest<{ result: LookupResult }>({
		url: '/lookup',
		method: 'get',
	});

	const { state: servers, fetch: fetchServers } = useRecoilRequest(
		{
			url: '/servers',
			method: 'get',
		},
		serversState,
	);

	const areSearchResultsShown = useMemo(
		() => !!searchQuery.trim(),
		[searchQuery],
	);

	const handleSearch = useCallback(() => {
		if (searchQuery.trim()) {
			fetchLookup({
				params: {
					q: searchQuery.trim(),
				},
			});
		}
	}, [searchQuery, fetchLookup]);

	const lookupResultsMarkup = useMemo(() => {
		if (!lookupResults.isFetched) {
			return;
		}

		if (!lookupResults.data.result) {
			return <>No results found.</>;
		}

		switch (lookupResults.data.result.type) {
			case LOOKUP_RESULT_TRACK:
				return (
					<Track
						title={lookupResults.data.result.title}
						duration={lookupResults.data.result.duration}
						cover={lookupResults.data.result.cover}
					/>
				);
			case LOOKUP_RESULT_PLAYLIST:
				return (
					<Playlist
						name={lookupResults.data.result.name}
						size={lookupResults.data.result.size}
						cover={lookupResults.data.result.cover}
					/>
				);
		}
	}, [lookupResults.isFetched, lookupResults.data]);

	useEffect(() => {
		if (!servers.isFetched) {
			fetchServers();
		}
	}, [fetchServers]);

	useEffect(() => {
		if (searchQueryPrev !== undefined) {
			updateLookupResults(() => ({
				isFetched: false,
				isFetching: false,
				status: 'pending',
				data: undefined,
				error: undefined,
			}));
		}
	}, [searchQueryPrev]);

	return (
		<>
			{areSearchResultsShown && <SearchResultsOverlay />}
			<Root>
				<Middle>
					<TrackInput
						hasResults={areSearchResultsShown}
						icon='link'
						placeholder='Enter URL or track name...'
						value={searchQuery}
						onChange={setSearchQuery}
						onEnter={handleSearch}
					/>
					{areSearchResultsShown && (
						<SearchResultsPanel>
							{!!searchQuery &&
								!lookupResults.isFetching &&
								!lookupResults.isFetched &&
								!lookupResults.error && (
									<i>
										Press Enter to search or Shift-Enter to add to the queue
									</i>
								)}
							{lookupResults.isFetching && <i>Searching...</i>}
							{lookupResults.isFetched && lookupResultsMarkup}
						</SearchResultsPanel>
					)}
				</Middle>
				<Right>
					<ProfileInfo>
						<Icon>account_circle</Icon>
						<ProfileName>bloberenober</ProfileName>
						<Icon>expand_more</Icon>
					</ProfileInfo>
				</Right>
			</Root>
		</>
	);
};

export default Header;

const Root = styled.div`
	height: 90px;
	width: 100%;
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	align-items: start;
`;

const Middle = styled.div`
	flex: 1;
	display: flex;
	flex-flow: row nowrap;
	justify-content: center;
	position: relative;
	top: 25px;
`;

const TrackInput = styled(Input)<{ hasResults: boolean }>`
	width: 100%;
	position: relative;
	z-index: 2;

	${({ hasResults }) =>
		hasResults &&
		css`
			input {
				border-bottom-left-radius: 0;
				border-bottom-right-radius: 0;
			}
		`}
`;

const SearchResultsPanel = styled.div`
	background-color: ${Colors.backgroundMedium};
	width: 100%;
	position: absolute;
	left: 0;
	top: 0;
	z-index: 1;
	border-radius: 20px;
	padding: 50px 10px 10px;
`;

const Right = styled.div`
	width: 460px;
	display: flex;
	flex-flow: row nowrap;
	justify-content: end;
	align-self: center;
`;

const ProfileInfo = styled.div`
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	cursor: pointer;
	color: ${Colors.iconColor};
	transition: color ${Animation.durationMs}ms;

	&:hover {
		&,
		* {
			color: ${Colors.font};
		}
	}
`;

const ProfileName = styled.div`
	max-width: 200px;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const SearchResultsOverlay = styled.div`
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.7);
	z-index: 1;
`;
