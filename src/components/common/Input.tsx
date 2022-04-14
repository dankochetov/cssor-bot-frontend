import {
	ChangeEvent,
	InputHTMLAttributes,
	useCallback,
	useEffect,
	useRef,
} from 'react';
import { FC } from 'react';
import styled from 'styled-components/macro';

import Colors from '../../schema/colors';
import Icon from './Icon';
import { useKeyPress, usePreviousDistinct } from 'react-use';

interface Props {
	icon: string;
	value?: string;
	onChange?: (value: string) => void;
	onEnter?: () => void;
}

const Input: FC<
	Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & Props
> = ({ icon, className, onChange, onEnter, ...props }) => {
	const input = useRef<HTMLInputElement>(null);
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

	useEffect(() => {
		if (isEnterPressedPrev !== undefined && !isEnterPressedPrev) {
			onEnter?.();
		}
	}, [isEnterPressedPrev, onEnter]);

	return (
		<Root className={className}>
			<InputElement {...props} ref={input} onChange={handleChange} />
			<InputIcon>{icon}</InputIcon>
			{!!props.value && (
				<ClearIcon onClick={handleClear} title='Clear input'>
					close
				</ClearIcon>
			)}
		</Root>
	);
};

export default Input;

const Root = styled.div`
	position: relative;
`;

const InputElement = styled.input`
	outline: none;
	border: 0;
	background-color: #4f5356;
	color: ${Colors.font};
	height: 40px;
	width: 100%;
	border-radius: 20px;
	padding: 0 40px;
	font-family: Rubik, sans-serif;
	font-size: 17px;
	font-weight: 400;

	::placeholder {
		color: ${Colors.font};
	}
`;

const InputIcon = styled(Icon)`
	position: absolute;
	left: 5px;
	top: 50%;
	transform: translateY(-50%);
	pointer-events: none;
`;

const ClearIcon = styled(Icon)`
	position: absolute;
	right: 5px;
	top: 50%;
	transform: translateY(-50%);
`;
