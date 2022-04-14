import { HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react';
import { FC } from 'react';
import styled, { css, keyframes } from 'styled-components/macro';
import _throttle from 'lodash.throttle';

interface Props {
	maxWidth: number;
	children: string;
}

const LongText: FC<Props & HTMLAttributes<HTMLDivElement>> = ({
	maxWidth,
	children,
	...props
}) => {
	const calculatorBlock = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState<number | undefined>();

	useEffect(() => {
		if (calculatorBlock.current) {
			setWidth(calculatorBlock.current.getBoundingClientRect().width);
		}
	}, [calculatorBlock.current, setWidth]);

	useEffect(() => {
		const onResize = _throttle(
			() => {
				setWidth(undefined);
			},
			500,
			{ leading: false },
		);

		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('resize', onResize);
		};
	});

	return (
		<Root maxWidth={maxWidth} {...props} title={children}>
			{typeof width === 'number' ? (
				<Inner width={width} maxWidth={maxWidth}>
					{children}
				</Inner>
			) : (
				<CalculatorBlock ref={calculatorBlock}>{children}</CalculatorBlock>
			)}
		</Root>
	);
};

export default LongText;

const Root = styled.div<{ maxWidth: number }>`
	max-width: ${({ maxWidth }) => maxWidth}px;
	overflow: hidden;
	white-space: nowrap;
`;

const ANIMATION_SPEED = 25;
const ANIMATION_DELAY_START = 2;
const ANIMATION_DELAY_END = 2;

const animation = ({
	width,
	maxWidth,
}: {
	width: number;
	maxWidth: number;
}) => keyframes`
	0% {
		transform: translateX(0);
	}

	${(ANIMATION_DELAY_START * 100) / ((width - maxWidth) / ANIMATION_SPEED)}% {
		transform: translateX(0);
	}

	${
		(((width - maxWidth) / ANIMATION_SPEED - ANIMATION_DELAY_END) * 100) /
		((width - maxWidth) / ANIMATION_SPEED)
	}% {
  		transform: translateX(-${width - maxWidth}px);
	}
	
	100% {
  		transform: translateX(-${width - maxWidth}px);
	}
`;

const Inner = styled.div<{ width: number; maxWidth: number }>`
	display: flex;
	white-space: nowrap;

	${({ width, maxWidth }) =>
		width > maxWidth &&
		css`
			animation: ${animation({ width, maxWidth })}
				${(width - maxWidth) / ANIMATION_SPEED}s linear infinite;

			&:hover {
				animation-play-state: paused;
			}
		`}
`;

const CalculatorBlock = styled.div`
	position: absolute;
	white-space: nowrap;
	visibility: hidden;
`;
