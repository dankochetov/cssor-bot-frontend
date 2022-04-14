import { FC } from 'react';
import styled, { css } from 'styled-components/macro';
import { Scrollbars } from 'react-custom-scrollbars';
import { v4 as uuid } from 'uuid';

import Colors from '../schema/colors';
import Constants from '../schema/constants';
import Icon from './common/Icon';
import Track from './common/Track';

interface Track {
	id: string;
	title: string;
	duration: number;
	cover: string;
}

const tracks: Track[] = [
	{
		id: uuid(),
		title: `Baba O'Riley`,
		duration: 300,
		cover: 'https://picsum.photos/seed/1/160/90',
	},
	{
		id: uuid(),
		title: 'Woh Din Aayega',
		duration: 285,
		cover: 'https://picsum.photos/seed/2/160/90',
	},
	{
		id: uuid(),
		title: 'Riders On the Storm',
		duration: 434,
		cover: 'https://picsum.photos/seed/3/160/90',
	},
	{
		id: uuid(),
		title: 'Fire and Rain',
		duration: 200,
		cover: 'https://picsum.photos/seed/4/160/90',
	},
];

interface Props {
	isShown: boolean;
	hideQueue: () => void;
}

const Queue: FC<Props> = ({ isShown, hideQueue }) => {
	return (
		<Root isShown={isShown}>
			<h2>Now Playing</h2>
			<CloseIcon onClick={hideQueue} title='Hide queue'>
				close
			</CloseIcon>
			<CurrentlyPlayingTrack
				title='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor'
				duration={429}
				cover='https://picsum.photos/seed/0/160/90'
				hideControls
			/>
			<NextUpText>
				Next Up ({tracks.length})
				<ShuffleIcon title='Shuffle queue'>shuffle</ShuffleIcon>
			</NextUpText>
			<QueueScrollPane>
				{tracks.map((t) => (
					<QueueTrack
						key={t.id}
						title={t.title}
						duration={t.duration}
						cover={t.cover}
					/>
				))}
			</QueueScrollPane>
		</Root>
	);
};

export default Queue;

const Root = styled.div<{ isShown: boolean }>`
	position: relative;
	margin: 10px 0 10px 0;
	width: 450px;
	background: ${Colors.backgroundMedium};
	border-radius: ${Constants.borderRadius}px;
	padding: 15px;
	display: flex;
	flex-flow: column nowrap;

	${({ isShown }) =>
		!isShown &&
		css`
			visibility: hidden;
		`}
`;

const CloseIcon = styled(Icon)`
	position: absolute;
	top: 10px;
	right: 10px;
`;

const NextUpText = styled.h2`
	margin-bottom: 15px;
	position: relative;
`;

const ShuffleIcon = styled(Icon)`
	position: absolute;
	right: -5px;
`;

const QueueTrack = styled(Track)`
	padding: 2px 15px;
`;

const CurrentlyPlayingTrack = styled(QueueTrack)`
	margin: 30px -15px;
`;

const QueueScrollPane = styled(Scrollbars)`
	padding: 0;
	margin: 0 -15px;
	width: auto !important;
`;
