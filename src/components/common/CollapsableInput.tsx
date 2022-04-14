import {
	ChangeEvent,
	InputHTMLAttributes,
	ReactFragment,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import { FC } from 'react';
import styled, { css } from 'styled-components/macro';
import classNames from 'classnames';
import { useKeyPress, usePreviousDistinct } from 'react-use';

import Colors from '@/schema/colors';
import Icon from '@/components/common/Icon';
import Animation from '@/schema/animation';

interface Props {
	width: number;
	icon: string | ReactFragment;
	value?: string;
	onChange?: (value: string) => void;
	onEnter?: () => void;
}

const CollapsableInput: FC<
	Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & Props
> = ({ width, className, icon, onChange, onEnter, ...props }) => {
	const input = useRef<HTMLInputElement>(null);
	const [hasFocus, setFocus] = useState(false);
	const [isEnterPressed] = useKeyPress((e) => e.key === 'Enter');
	const isEnterPressedPrev = usePreviousDistinct(isEnterPressed);

	const handleChange = useCallback(
		({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
			onChange?.(value);
		},
		[onChange],
	);

	const handleClear = useCallback(() => {
		onChange?.('');
		input.current?.focus();
	}, [onChange]);

	const handleFocus = useCallback(() => {
		setFocus(true);
	}, [setFocus]);

	const handleBlur = useCallback(() => {
		setFocus(false);
	}, [setFocus]);

	useEffect(() => {
		if (isEnterPressedPrev !== undefined && !isEnterPressedPrev) {
			onEnter?.();
		}
	}, [isEnterPressedPrev, onEnter]);

	return (
		<Root
			className={className}
			inputWidth={width}
			hasFocus={hasFocus || !!props.value}
		>
			<Input
				{...props}
				ref={input}
				inputWidth={width}
				onChange={handleChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
				className={classNames({ 'has-value': !!props.value })}
			/>
			<InputIconWrapper>
				{typeof icon === 'string' ? <Icon>{icon}</Icon> : icon}
			</InputIconWrapper>
			{!!props.value && (
				<ClearIcon onClick={handleClear} title='Clear input'>
					close
				</ClearIcon>
			)}
		</Root>
	);
};

export default CollapsableInput;

const InputIconWrapper = styled.div`
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	pointer-events: none;
	transition: left ${Animation.durationMs}ms;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
`;

const ClearIcon = styled(Icon)`
	position: absolute;
	right: 5px;
	top: 50%;
	transform: translateY(-50%);
`;

const Input = styled.input<{ inputWidth: number }>`
	outline: none;
	border: 0;
	background-color: #4f5356;
	color: ${Colors.font};
	height: 40px;
	width: 100%;
	border-radius: 20px;
	font-family: Rubik, sans-serif;
	font-size: 17px;
	font-weight: 400;
	transition-property: width, background-color;
	transition-duration: ${Animation.durationMs}ms;

	:not(:focus):not(.has-value) {
		background-color: transparent;
		cursor: pointer;

		+ ${InputIconWrapper} {
			left: -5px;

			+ ${ClearIcon} {
				display: none;
			}
		}

		:hover {
			+ ${InputIconWrapper} * {
				color: ${Colors.font};
			}
		}

		::placeholder {
			opacity: 0;
		}
	}

	:focus,
	&.has-value {
		padding: 0 15px 0 40px;

		+ ${InputIconWrapper} {
			left: 3px;
		}
	}

	::placeholder {
		color: ${Colors.font};
	}
`;

const Root = styled.div<{ inputWidth: number; hasFocus: boolean }>`
	position: relative;
	width: 30px;
	transition: width ${Animation.durationMs}ms;

	${({ hasFocus, inputWidth }) =>
		hasFocus &&
		css`
			width: ${inputWidth}px;
		`}
`;
