import { useState } from 'react';
import { FC } from 'react';
import styled from 'styled-components/macro';
import { Link, useParams } from 'react-router-dom';

import Icon from '@/components/common/Icon';
import CollapsableInput from '@/components/common/CollapsableInput';

const Playlist: FC = () => {
	const params = useParams<{ id: string }>();
	const [tracksFilter, setTracksFilter] = useState('');

	return (
		<Root>
			<Header>
				<RootLink to='/'>Playlists</RootLink>{' '}
				<Icon isStatic>arrow_forward_ios</Icon> {params.id}{' '}
			</Header>
			<CollapsableInput
				width={300}
				icon={<Icon size={30}>filter_alt</Icon>}
				placeholder='Filter tracks...'
				value={tracksFilter}
				onChange={setTracksFilter}
			/>
		</Root>
	);
};

export default Playlist;

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

const RootLink = styled(Link)`
	:hover {
		text-decoration: underline;
	}
`;
