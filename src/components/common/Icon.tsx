import { CSSProperties, HTMLAttributes } from 'react';
import { FC } from 'react';
import styled, { css } from 'styled-components/macro';
import classNames from 'classnames';
import Colors from '../../schema/colors';
import Animation from '../../schema/animation';

interface Props {
	size?: 18 | 24 | 36 | 48 | number;
	isActive?: boolean;
	isStatic?: boolean;
	outlined?: boolean;
	round?: boolean;
}

const Icon: FC<HTMLAttributes<HTMLDivElement> & Props> = ({
	size,
	style,
	isActive = false,
	isStatic = false,
	outlined = false,
	round = false,
	...props
}) => {
	const additionalStyle: CSSProperties = {};
	if (size) {
		additionalStyle.fontSize = `${size}px`;
	}

	let materialClassName;
	if (outlined) {
		materialClassName = 'material-icons-outlined';
	} else if (round) {
		materialClassName = 'material-icons-round';
	} else {
		materialClassName = 'material-icons';
	}

	return (
		<Root
			{...props}
			isActive={isActive}
			isStatic={isStatic}
			className={classNames(materialClassName, props.className)}
			style={{ ...additionalStyle, ...style }}
		/>
	);
};

const Root = styled.div<{ isActive: boolean; isStatic: boolean }>`
	padding: 5px;
	transition: color ${Animation.durationMs}ms;
	user-select: none;

	${({ isActive }) =>
		isActive &&
		css`
			color: ${Colors.primaryBlue};
		`}

	${({ isStatic }) =>
		!isStatic &&
		css`
			cursor: pointer;
		`}

	${({ isActive, isStatic }) =>
		!isActive &&
		!isStatic &&
		css`
			color: ${Colors.iconColor};
			&:hover {
				color: ${Colors.iconColorHover};
			}
		`}
`;

export default Icon;
