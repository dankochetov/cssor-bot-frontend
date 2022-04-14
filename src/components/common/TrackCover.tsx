import { FC } from 'react';
import styled from 'styled-components/macro';

import 'react-placeholder/lib/reactPlaceholder.css';

import Constants from '../../schema/constants';
import Colors from '@/schema/colors';

interface Props {
	src: string | null;
}

const TrackCover: FC<Props> = ({ src }) => {
	return <Root>{src ? <Image src={src} /> : <Placeholder />}</Root>;
};

export default TrackCover;

const Root = styled.div`
	width: 66px;
	height: 66px;
	position: relative;
`;

const Image = styled.img`
	width: 100%;
	height: 100%;
	object-fit: contain;
	border-radius: ${Constants.borderRadius}px;
`;

const Placeholder = styled.div`
	width: 100%;
	height: 100%;
	background-color: ${Colors.backgroundLight};
	border-radius: ${Constants.borderRadius}px;
`;
