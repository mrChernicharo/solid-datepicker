import { JSXElement } from 'solid-js';
import { keyframes, styled } from 'solid-styled-components';
import { DatepickerColor, Theme } from '../utils/helpers';

// const colors = (theme: Theme) => {
// 	bg: theme === 'dark' ? '#3c3b46' : '#fff';
// 	bgDark: theme === 'dark' ? '#282c34' : '#ccc';
// 	bgMedium: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)';

// 	text: #fff;
// 	textMedium: rgba(255, 255, 255, 0.2);
// 	textSecondary: rgba(255, 255, 255, 0.4);
// 	textDark: #999;
// }

const underlineEnter = keyframes`
0% {
    width: 50%;
}

100% {
    width: 0%;
}
`;

const underlineLeave = keyframes`
0% {
    width: 0%;
}

100% {
    width: 50%;
}`;

const darkColors = {
	bg: '#3c3b46',
	bgDark: '#282c34',
	bgMedium: 'rgba(255, 255, 255, 0.1)',

	text: '#fff',
	textMedium: 'rgba(255, 255, 255, 0.2)',
	textSecondary: 'rgba(255, 255, 255, 0.4)',
	textDark: '#999',
};

const lightColors = {
	bg: '#fff',
	bgDark: '#ddd',
	bgMedium: 'rgba(255, 255, 255, 0.9)',

	text: '#000',
	textMedium: 'rgba(255, 255, 255, 0.8)',
	textSecondary: 'rgba(255, 255, 255, 0.6)',
	textDark: '#333',
};

const color = (theme: Theme, color: DatepickerColor) =>
	theme === 'dark' ? darkColors[color] : lightColors[color];

const DatePickerContainer = styled('div')`
	font-size: 16px;
	position: relative;
	display: inline-block;

	button {
		color: ${darkColors.text};
		background: transparent;
		border: none;
		border-radius: 50%;
		height: 32px;
		width: 32px;

		display: flex;
		align-items: center;
		justify-content: center;
		transition: 0.2s;

		outline: none;
		cursor: pointer;
	}
`;

const InputField = styled('div')(
	(props: any) => `
	padding: 1.25rem 1rem 0.75rem;
	position: relative;
	background-color: ${darkColors.bg};
	border-top-left-radius: 0.35rem;
	border-top-right-radius: 0.35rem;
	width: ${props.width}px;

	&:hover > .outline {
		height: 3px;
		transition: 0.2s;
	}
`
);

const InputWrapper = styled('label')(
	(props: any) => `
    position: relative;
    display: flex;
    background-color: transparent;
    cursor: ${props.cursor}
`
);

const InputLabel = styled('div')(
	(props: any) => `
	font-size: 13px;
	position: absolute;
	left: 2px;
	transition: all 0.3s;
	color: ${
		props.isDisabled
			? darkColors.textMedium
			: props.isFocused
			? props.color
			: darkColors.text
	};
	pointer-events: none;
	transform: ${props.isFocused ? `translate(-6px, -16px) scale(0.84);` : ''}
`
);

const Input = styled('input')(
	(props: any) => `
	display: flex;
	background-color: transparent;
	color: #fff;
	border: none;
	outline: none;
	font-size: 15px;

	&::placeholder {
		opacity: 0;
		transition: 0.3s;
	}

	&:focus::placeholder {
		color: ${darkColors.textDark};
		opacity: 1;
	}
	`
);

const InputButton = styled('button')`
	position: absolute;
	right: 0px;
	top: -8px;

	&:hover:not(:disabled),
	&:focus:not(:disabled) {
		background: ${darkColors.bgMedium};
	}

	&:disabled {
		cursor: default;
		color: ${darkColors.textMedium};
	}
`;

const InputOutline = styled('div')(
	(props: any) => `
	bottom: 0;
	height: ${props.isFocused ? '2px' : '1px'};
	width: 100%;
	position: absolute;
	left: 0;
    color: ${darkColors.text};
    background: ${props.isFocused ? props.color : darkColors.textSecondary};
    transition: .2s;

    &::before {
        content: "";
        width: 50%;
        height: 2px;
        background-color: #666;
        position: absolute;
        left: 0;

        animation: ${
			props.isFocused
				? `${underlineEnter} 0.2s ease-in forwards;`
				: `${underlineLeave} 0.2s ease-in forwards;`
		}
    }

    &::after {
        content: "";
        width: 50%;
        height: 2px;
        background-color: #666;
        position: absolute;
        right: 0;

        animation: ${
			props.isFocused
				? `${underlineEnter} 0.2s ease-in forwards;`
				: `${underlineLeave} 0.2s ease-in forwards;`
		}
    }
`
);

const HintContainer = styled('div')`
	height: 20px;
	font-size: 14px;
`;

const HintText = styled('div')`
	font-variant: small-caps;

	position: absolute;
	left: 18px;
`;

const WeekdayCell = styled('div')`
	height: 24px;
`;

const CalendarHeader = styled('div')`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.5rem;
`;

const CalendarPopup = styled('div')`
	background-color: ${darkColors.bg};
	border: 1px solid ${darkColors.textMedium};
	position: absolute;

	z-index: 1000;
	opacity: 0;
	margin-top: -16px;

	transition: 0.3s;
`;

const CalendarButtonGroup = styled('div')`
	display: inherit;

	button:focus,
	button:hover {
		background: ${darkColors.bgMedium};
	}
`;
const CalendarCell = styled('div')(
	(props: any) => `

	border: none;
	border-radius: 50%;
	width: 36px;
	height: 36px;
	display: flex;
	justify-content: center;
	align-items: center;

	visibility: ${props.isVisible ? 'visible' : 'hidden'};
	background: ${props.isSelected ? props.color : 'transparent'};
	button {
		color: ${props.disabled ? darkColors.textSecondary : darkColors.text};
		cursor: ${props.disabled ? 'default' : 'pointer'};
	}

	button:focus,
	button:hover {
		background: ${props.disabled ? 'transparent' : darkColors.bgMedium};
	}
`
);

const Overlay = styled('div')`
	position: fixed;
	top: 0;
	left: 0;
	width: 1000vw;
	height: 1000vh;
	opacity: 0.01;
	z-index: 900;
`;

export {
	DatePickerContainer,
	InputWrapper,
	InputButton,
	HintContainer,
	HintText,
	WeekdayCell,
	CalendarHeader,
	InputField,
	InputOutline,
	InputLabel,
	Input,
	CalendarPopup,
	CalendarButtonGroup,
	CalendarCell,
	Overlay,
};
