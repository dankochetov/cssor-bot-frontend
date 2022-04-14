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
	title: string;
	duration: number;
	cover: string | null;
	hideControls?: boolean;
}

const Track: FC<HTMLAttributes<HTMLDivElement> & Props> = ({
	title,
	duration,
	cover,
	hideControls = false,
	...props
}) => {
	return (
		<Root {...props}>
			<TrackCover src={cover} />
			<SongText>
				<Title>
					<LongText maxWidth={193}>{title}</LongText>
				</Title>
				<Duration>&nbsp;/ {formatDuration(duration)}</Duration>
			</SongText>
			{!hideControls && (
				<Actions>
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

export default Track;

const Root = styled.div`
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	transition: background-color ${Animation.durationMs}ms;

	&:hover {
		background: ${Colors.backgroundLight};
	}
`;

const SongText = styled.div`
	flex: 1;
	display: flex;
	flex-flow: row nowrap;
	font-size: 10pt;
	margin-left: 12px;
`;

const Title = styled.div`
	font-weight: 400;
`;

const Duration = styled.div`
	font-weight: 400;
	color: #87868c;
`;

const Actions = styled.div`
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
`;
