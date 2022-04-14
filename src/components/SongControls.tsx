import { useCallback, useState } from 'react';
import { FC } from 'react';
import styled from 'styled-components/macro';

import Icon from './common/Icon';
import LongText from './common/LongText';
import Colors from '../schema/colors';
import TrackCover from './common/TrackCover';

interface RepeatMode {
	type: 'none' | 'one' | 'all';
	title: string;
	icon: string;
	isActive?: boolean;
}

const repeatModes: RepeatMode[] = [
	{ type: 'none', title: 'Repeat off', icon: 'repeat' },
	{
		type: 'one',
		title: 'Repeat 1 track',
		icon: 'repeat_one',
		isActive: true,
	},
	{ type: 'all', title: 'Repeat all', icon: 'repeat', isActive: true },
];

interface Props {
	toggleQueue: () => void;
	isQueueShown: boolean;
}

const SongControls: FC<Props> = ({ toggleQueue, isQueueShown }) => {
	const [isPaused, setPaused] = useState(false);
	const [repeatMode, setRepeatMode] = useState<RepeatMode>(repeatModes[0]);
	const [isShuffleMode, setShuffleMode] = useState(false);

	const togglePause = useCallback(() => {
		setPaused((v) => !v);
	}, [setPaused]);

	const toggleRepeatMode = useCallback(() => {
		setRepeatMode(
			(v) => repeatModes[(repeatModes.indexOf(v) + 1) % repeatModes.length],
		);
	}, [setRepeatMode]);

	const toggleShuffleMode = useCallback(() => {
		setShuffleMode((v) => !v);
	}, [setShuffleMode]);

	return (
		<Root>
			<Left>
				<TrackCover src='https://picsum.photos/160/90' />
				<SongText>
					<SongTitle maxWidth={300}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor
					</SongTitle>
					<SongAlbum maxWidth={300}>Shitalchandra</SongAlbum>
				</SongText>
			</Left>
			<Middle>
				<MiddleTop>
					<SongControlIcon size={28} title='Add to playlist...'>
						playlist_add
					</SongControlIcon>
					<SongControlIcon
						size={26}
						title='Random order'
						onClick={toggleShuffleMode}
						isActive={isShuffleMode}
					>
						shuffle
					</SongControlIcon>
					<PauseIcon
						size={48}
						onClick={togglePause}
						title={isPaused ? 'Resume' : 'Pause'}
					>
						{isPaused ? 'play_arrow' : 'pause'}
					</PauseIcon>
					<SongControlIcon size={36} title='Skip track'>
						skip_next
					</SongControlIcon>
					<SongControlIcon
						size={26}
						isActive={repeatMode.isActive}
						title={repeatMode.title}
						onClick={toggleRepeatMode}
					>
						{repeatMode.icon}
					</SongControlIcon>
				</MiddleTop>
				<MiddleBottom>
					<SongDurationText>2:05</SongDurationText>
					<ProgressBarWrapper>
						<ProgressBar>
							<ProgressBarActive />
						</ProgressBar>
					</ProgressBarWrapper>
					<SongDurationText>4:29</SongDurationText>
				</MiddleBottom>
			</Middle>
			<Right>
				<Icon
					size={36}
					title={isQueueShown ? 'Hide queue' : 'Show queue'}
					isActive={isQueueShown}
					onClick={toggleQueue}
				>
					queue_music
				</Icon>
			</Right>
		</Root>
	);
};

export default SongControls;

const Root = styled.div`
	width: 100%;
	background-color: ${Colors.backgroundLight};
	height: 90px;
	display: flex;
	flex-flow: row nowrap;
	padding: 12px;
	border-radius: 5px 5px 0 0;
	align-items: center;
	justify-content: space-between;
`;
const Left = styled.div`
	width: 30%;
	height: 100%;
	min-width: 180px;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
`;

const Middle = styled.div`
	width: 40%;
	max-width: 722px;
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
`;

const MiddleTop = styled.div`
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	margin-top: -15px;
`;

const MiddleBottom = styled.div`
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	align-self: stretch;
`;

const Right = styled.div`
	width: 30%;
	min-width: 180px;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	justify-content: end;
`;

const SongText = styled.div`
	display: flex;
	flex-flow: column nowrap;
	font-size: 10pt;
	margin-left: 12px;
`;

const SongTitle = styled(LongText)`
	font-weight: 500;
`;

const SongAlbum = styled(LongText)`
	font-weight: 400;
	color: #87868c;
	margin-top: 3px;
`;

const SongControlIcon = styled(Icon)`
	margin: 0 5px;
`;

const PauseIcon = styled(SongControlIcon)`
	padding-bottom: 0;
	margin-bottom: 5px;
`;

const SongDurationText = styled.div`
	margin: 0 10px;
	font-size: 13px;
	user-select: none;
`;

const ProgressBarWrapper = styled.div`
	cursor: pointer;
	padding: 5px 0;
	width: 100%;
`;

const ProgressBar = styled.div`
	width: 100%;
	height: 3px;
	border-radius: 3px;
	align-self: center;
	overflow: hidden;
	background: #b6b6b6;
`;

const ProgressBarActive = styled.div`
	height: 100%;
	width: 30%;
	background: ${Colors.primaryBlue};
	background: linear-gradient(
		90deg,
		${Colors.primaryBlue} 0%,
		${Colors.primaryPurple} 100%
	);
	transition: width 100ms;
`;
