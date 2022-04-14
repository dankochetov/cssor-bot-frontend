import { HTMLAttributes } from 'react';
import { FC } from 'react';
import styled from 'styled-components/macro';

import TrackCover from './TrackCover';
import LongText from './LongText';
import Colors from '../../schema/colors';
import Animation from '../../schema/animation';
import formatDuration from '../../utils/formatDuration';
import Icon from './Icon';

interface Props {
	name: string;
	size: number;
	cover: string | null;
	hideControls?: boolean;
}

const Playlist: FC<HTMLAttributes<HTMLDivElement> & Props> = ({
	name,
	size,
	cover,
	hideControls = false,
	...props
}) => {
	return (
		<Root {...props}>
			<TrackCover src={cover} />
			<PlaylistText>
				<Title>
					<LongText maxWidth={193}>{name}</LongText>
				</Title>
				<Size>&nbsp;/ {size} tracks</Size>
			</PlaylistText>
			{!hideControls && (
				<Actions>
					<Icon title='Play now' size={25}>
						play_arrow
					</Icon>
					<Icon title='Queue next' size={27}>
						skip_next
					</Icon>
					<Icon title='Remove from queue' size={24}>
						close
					</Icon>
				</Actions>
			)}
		</Root>
	);
};

export default Playlist;

const Root = styled.div`
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	transition: background-color ${Animation.durationMs}ms;

	&:hover {
		background: ${Colors.backgroundLight};
	}
`;

const PlaylistText = styled.div`
	flex: 1;
	display: flex;
	flex-flow: row nowrap;
	font-size: 10pt;
	margin-left: 12px;
`;

const Title = styled.div`
	font-weight: 400;
`;

const Size = styled.div`
	font-weight: 400;
	color: #87868c;
`;

const Actions = styled.div`
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
`;
