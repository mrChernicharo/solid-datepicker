import { JSXElement } from "solid-js";
import { keyframes, styled } from "solid-styled-components";
import { DatepickerColor, Theme } from "../utils/helpers";

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
	bg: "#3c3b46",
	bgDark: "#282c34",
	bgMedium: "rgba(255, 255, 255, 0.1)",

	text: "#fff",
	textMedium: "rgba(255, 255, 255, 0.2)",
	textSecondary: "rgba(255, 255, 255, 0.4)",
	textDark: "#999",
};

const lightColors = {
	bg: "#fff",
	bgDark: "#ddd",
	bgMedium: "rgba(255, 255, 255, 0.9)",

	text: "#000",
	textMedium: "rgba(255, 255, 255, 0.8)",
	textSecondary: "rgba(255, 255, 255, 0.6)",
	textDark: "#333",
};

const color = (theme: Theme, color: DatepickerColor) =>
	theme === "dark" ? darkColors[color] : lightColors[color];

const DatePickerContainer = styled("div")`
	font-size: 16px;
	position: relative;
	display: inline-block;
`;

const InputWrapper = styled("label")(
	(props: any) => `
    position: relative;
    display: flex;
    background-color: transparent;
    cursor: ${props.cursor}
`
);

const InputButton = styled("button")`
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

const InputOutline = styled("div")(
	(props: any) => `
	bottom: 0;
	height: ${props.isFocused ? "2px" : "1px"};
	width: 100%;
	position: absolute;
	left: 0;
    color: ${darkColors.textSecondary};
    background: ${props.isFocused ? props.color : darkColors.bgMedium};
    transition: .2s;

    &::before {
        content: "";
        width: 50%;
        height: 2px;
        background-color: #333;
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
        background-color: #333;
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

const HintContainer = styled("div")`
	height: 16px;
`;

const HintText = styled("div")`
	font-variant: small-caps;

	position: absolute;
	left: 18px;
`;

const WeekdayCell = styled("div")`
	height: 24px;
`;

const CalendarHeader = styled("div")`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.5rem;
`;

export {
	DatePickerContainer,
	InputWrapper,
	InputButton,
	HintContainer,
	HintText,
	WeekdayCell,
	CalendarHeader,
	InputOutline,
};
