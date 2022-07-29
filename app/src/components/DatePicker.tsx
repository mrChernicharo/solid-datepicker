import {
	createEffect,
	createSignal,
	For,
	mergeProps,
	onMount,
	Show,
} from 'solid-js';
import { Transition } from 'solid-transition-group';
import {
	getDaysGrid,
	getWeekdays,
	idMaker,
	isCurrentMonth,
	DatePickerType,
	parseDateString,
	isSameDate,
	getDateFormat,
	maskInput,
	DateCell,
	DatepickerProps,
	DateSchema,
	Theme,
	DatepickerColor,
	checkIsDisabled,
	LogicCell,
} from '../utils/helpers';
import {
	DEFAULT_ICON,
	MONTH_DECREMENT_ICON,
	MONTH_INCREMENT_ICON,
	YEAR_DECREMENT_ICON,
	YEAR_INCREMENT_ICON,
} from './icons';

import {
	DatePickerContainer,
	HintContainer,
	InputButton,
	InputWrapper,
	HintText,
	WeekdayCell,
	CalendarHeader,
	InputOutline,
	InputLabel,
	InputField,
	Input,
	Overlay,
	CalendarButtonGroup,
	CalendarCell,
	CalendarGrid,
	CalendarPopup,
} from './StyledComponents';

const DEFAULT_PROPS: DatepickerProps = {
	ref: null,
	value: null,
	color: '#009898',
	icon: DEFAULT_ICON,
	hint: '',
	initialDate: new Date(),
	min: null,
	max: null,
	delimiter: '/',
	inputWidth: 160,
	errorMessage: 'invalid date',
	filter: (d: Date) => true,
	onDateSelected: (d: Date | null) => d, // both input and calendar,
	onInput: (e: any) => e, // input input,
	onChange: (e: any) => e, // input change,
	dateClass: (d: Date) => '',
	label: 'date picker',
	placeholder: 'placeholder',
	theme: 'light',
	applyMask: true,
	disabled: false,
	inputDisabled: false,
	calendarDisabled: false,
	closeAfterClick: false,
	hideYearButtons: false,
	locale: 'en',
	type: 'datePicker',
	touchUIMode: false,
	calendarOnly: false, // no input, calendar onl;
};

export function DatePicker(props: DatepickerProps) {
	props = mergeProps(DEFAULT_PROPS, props);

	// const id = `calendar-popup-${idMaker()}`;
	let inputRef!: HTMLInputElement,
		labelRef!: HTMLDivElement,
		outlineRef!: HTMLDivElement,
		calendarPopupRef!: HTMLDivElement,
		iconBtnRef!: HTMLButtonElement,
		monthDecrBtn!: HTMLButtonElement,
		monthIncrBtn!: HTMLButtonElement,
		yearDecrBtn!: HTMLButtonElement,
		yearIncrBtn!: HTMLButtonElement;
	let timeout: any;
	let grid: DateCell[] = [];
	let cellsRefs: HTMLDivElement[] = [];
	let cellsLogicGrid: LogicCell[] = [];

	const [isOpen, setIsOpen] = createSignal(false);
	const [inputFocused, setInputFocused] = createSignal(false);
	const [isValid, setIsValid] = createSignal(true);
	const [hasError, setHasError] = createSignal(false);
	const [shownDate, setShownDate] = createSignal(
		props.initialDate || props.value || new Date()
	);

	const getDateSchema = () => {
		const dateFormat = getDateFormat(
			props.value || new Date(),
			props.locale,
			props.delimiter
		);
		return dateFormat.replaceAll(props.delimiter || '/', '') as DateSchema; // YMD | }MDY | DMY
	};
	const getCurrentMonthYear = () => {
		return (shownDate() || new Date()).toLocaleDateString(props.locale, {
			month: 'short',
			year: 'numeric',
		});
	};
	const isValidDate = (str: string) => {
		const { year, month, day } = parseDateString(
			str,
			getDateSchema(),
			props.delimiter
		);

		console.log({ year, month, day });

		if (!day || day > 31) return false;
		if (isNaN(month) || month > 11) return false;
		if (!year) return false;

		const date = new Date(new Date(year, month, day).setFullYear(year));

		if (!isNaN(date.getTime())) return true;
	};
	const daysGrid = (date: Date | null): DateCell[] => {
		let d = date || new Date();
		grid = getDaysGrid(d, props.locale, props.delimiter);

		return grid;
	};

	// KEYBOARD NAVIGATION HELPERS
	const getCellBtnEl = (index: number): HTMLButtonElement => {
		let cell = cellsRefs[index]?.firstChild as HTMLButtonElement;

		return cell;
	};
	const findNextInColumn = (col: number, day = 0) => {
		return cellsLogicGrid.find(
			c => c.col === col && c.day > day && !c.disabled
		);
	};
	const findPrevInColumn = (col: number, day = 32) => {
		return cellsLogicGrid
			.slice()
			.reverse()
			.find(c => c.col === col && c.day < day && !c.disabled);
	};
	const findNextInRow = (row: number, day: number) => {
		return cellsLogicGrid.find(
			c => c.row === row && c.day > day && !c.disabled
		);
	};
	const findPrevInRow = (row: number, day: number) => {
		return cellsLogicGrid
			.slice()
			.reverse()
			.find(c => !c.disabled && c.row === row && c.day < day);
	};
	const findNextAvailable = (day = 0) => {
		return cellsLogicGrid.find(c => !c.disabled && day < c.day);
	};
	const findPrevAvailable = (day = 32) => {
		return cellsLogicGrid
			.slice()
			.reverse()
			.find(c => !c.disabled && day > c.day);
	};

	const focusHeaderButton = (cell: LogicCell) => {
		const colMapping = {};
		if (props.hideYearButtons) {
			colMapping[0] = monthDecrBtn;
			colMapping[1] = monthDecrBtn;
			colMapping[2] = monthDecrBtn;
			colMapping[3] = monthIncrBtn;
			colMapping[4] = monthIncrBtn;
			colMapping[5] = monthIncrBtn;
			colMapping[6] = monthIncrBtn;
		} else {
			colMapping[0] = yearDecrBtn;
			colMapping[1] = monthDecrBtn;
			colMapping[2] = monthDecrBtn;
			colMapping[3] = monthIncrBtn;
			colMapping[4] = monthIncrBtn;
			colMapping[5] = monthIncrBtn;
			colMapping[6] = yearIncrBtn;
		}

		const headerBtn = colMapping[cell.col];
		headerBtn.focus();
	};
	const focusFirstAvailableCell = () => {
		const firstAvailableCell = findNextAvailable();
		if (firstAvailableCell) {
			const freeIdx = cellsRefs.findIndex(
				c => Number(c.dataset.day) === firstAvailableCell.day
			);
			getCellBtnEl(freeIdx).focus();
		}
	};

	function handleInput(e) {
		let v = e.currentTarget.value;

		if (!v) return props.onDateSelected(null);

		if (props.applyMask) {
			v = maskInput(v, getDateSchema(), props.delimiter);

			// v = sliceLongNums(v)

			v = v.length > 10 ? v.slice(0, 10) : v;

			e.currentTarget.value = v;

			console.log({ valid: isValidDate(v), v });
			if (isValidDate(v)) {
				const { year, month, day } = parseDateString(
					v,
					getDateSchema(),
					props.delimiter
				);
				const date = new Date(
					new Date(year, month, day).setFullYear(year)
				);

				setIsValid(true);
				setHasError(false);
				props.onDateSelected(date);
				setShownDate(date);
			} else {
				// set error???
				// console.log("invalidDate", { v });
				setIsValid(false);
				props.onDateSelected(null);
			}
		}
		props.onInput && props.onInput(e);
	}
	function handleCellClick(d: DateCell) {
		if (props.closeAfterClick) {
			setIsOpen(false);
			inputRef.focus();
		}
		inputRef.value = d.dateStr;
		setIsValid(true);
		setHasError(false);
		props.onDateSelected(d.date);
	}

	// KEYDOWN METHODS
	function handleInputKeyDown(e) {
		if (e.code === 'Escape') {
			return setIsOpen(false);
		}
		if (e.code === 'Enter') {
			if (props.disabled || props.calendarDisabled) return;
			e.preventDefault();
		}

		// if (e.code === 'ArrowRight') {
		// 	return iconBtnRef.focus();
		// }

		if (e.code === 'ArrowDown') {
			if (props.disabled || props.calendarDisabled) return;
		}

		if (
			e.code === 'Enter' ||
			e.code === 'Space' ||
			e.code === 'ArrowDown'
		) {
			if (!isOpen()) {
				setIsOpen(true);
			}
			inputRef.blur();
			focusFirstAvailableCell();
		}
	}
	function handleIconButtonKeyDown(e) {
		{
			if (e.code === 'ArrowLeft') {
				return inputRef.focus();
			}
			if (e.code === 'ArrowDown') {
				if (props.disabled || props.calendarDisabled) return;
			}
			if (
				e.code === 'Enter' ||
				e.code === 'Space' ||
				e.code === 'ArrowDown'
			) {
				e.preventDefault(); // prevent input focus
				if (!isOpen()) {
					setIsOpen(true);
				}
				inputRef.blur();
				focusFirstAvailableCell();
			}
		}
	}
	function handleMonthDecrKeyDown(e: KeyboardEvent) {
		switch (e.code) {
			case 'Escape': {
				setIsOpen(false);
				break;
			}
			case 'Tab': {
				if (e.shiftKey && props.hideYearButtons) {
					setIsOpen(false);
					setTimeout(() => iconBtnRef.focus(), 300);
				}
				break;
			}
			case 'ArrowUp': {
				setIsOpen(false);
				if (props.inputDisabled) {
					iconBtnRef.focus();
				} else {
					inputRef.focus();
				}
				break;
			}
			case 'ArrowLeft': {
				yearDecrBtn && yearDecrBtn.focus();
				break;
			}
			case 'ArrowRight': {
				monthIncrBtn.focus();
				break;
			}
			case 'ArrowDown': {
				let nextLogicCell = props.hideYearButtons
					? findNextInColumn(0)
					: findNextInColumn(1);

				if (!nextLogicCell) {
					nextLogicCell = findNextAvailable();
				}

				if (nextLogicCell) {
					getCellBtnEl(nextLogicCell.day - 1).focus();
				}
			}
		}
	}
	function handleMonthIncrKeyDown(e: KeyboardEvent) {
		switch (e.code) {
			case 'Escape': {
				setIsOpen(false);
			}
			case 'ArrowUp': {
				setIsOpen(false);
				iconBtnRef.focus();
				break;
			}
			case 'ArrowLeft': {
				monthDecrBtn.focus();
				break;
			}
			case 'ArrowRight': {
				yearIncrBtn && yearIncrBtn.focus();
				break;
			}
			case 'ArrowDown': {
				let nextLogicCell = props.hideYearButtons
					? findNextInColumn(6)
					: findNextInColumn(5);

				if (!nextLogicCell) {
					nextLogicCell = findNextAvailable();
				}

				if (nextLogicCell) {
					getCellBtnEl(nextLogicCell.day - 1).focus();
				}
			}
		}
	}
	function handleYearDecrKeyDown(e: KeyboardEvent) {
		switch (e.code) {
			case 'Escape': {
				setIsOpen(false);
				break;
			}
			case 'Tab': {
				if (e.shiftKey) {
					setIsOpen(false);
					setTimeout(() => iconBtnRef.focus(), 300);
				}
				break;
			}
			case 'ArrowUp': {
				setIsOpen(false);
				if (props.inputDisabled) {
					iconBtnRef.focus();
				} else {
					inputRef.focus();
				}
				break;
			}
			case 'ArrowRight': {
				monthDecrBtn.focus();
				break;
			}
			case 'ArrowDown': {
				let nextLogicCell = findNextInColumn(0);

				if (!nextLogicCell) {
					nextLogicCell = findNextAvailable();
				}

				if (nextLogicCell) {
					getCellBtnEl(nextLogicCell.day - 1).focus();
				}
			}
		}
	}
	function handleYearIncrKeyDown(e: KeyboardEvent) {
		// console.log(document.activeElement);

		switch (e.code) {
			case 'Escape': {
				setIsOpen(false);
			}
			case 'ArrowUp': {
				setIsOpen(false);
				iconBtnRef.focus();
				break;
			}
			case 'ArrowLeft': {
				monthIncrBtn.focus();
				break;
			}
			case 'ArrowDown': {
				let nextLogicCell = findNextInColumn(6);

				if (!nextLogicCell) {
					nextLogicCell = findNextAvailable();
				}

				if (nextLogicCell) {
					getCellBtnEl(nextLogicCell.day - 1).focus();
				}
			}
		}
	}

	function handleCellKeyDown(e: KeyboardEvent, d: DateCell) {
		const currLogicCell = cellsLogicGrid.find(c => c.day === d.day)!;

		switch (e.code) {
			case 'Escape': {
				inputRef.focus();
				setIsOpen(false);
				break;
			}
			case 'Tab': {
				const lastCell = findPrevAvailable();
				if (currLogicCell.pos === lastCell?.pos) {
					setIsOpen(false);
				}
				break;
			}
			case 'ArrowUp': {
				let nextLogicCell = findPrevInColumn(
					currLogicCell.col,
					currLogicCell.day
				);
				if (!nextLogicCell) {
					focusHeaderButton(currLogicCell);
				}

				if (nextLogicCell) {
					getCellBtnEl(nextLogicCell.day - 1).focus();
				}
				break;
			}
			case 'ArrowRight': {
				let nextLogicCell = findNextInRow(
					currLogicCell.row,
					currLogicCell.day
				);

				if (!nextLogicCell) {
					nextLogicCell = findNextAvailable(currLogicCell.day);
				}

				if (nextLogicCell) {
					getCellBtnEl(nextLogicCell.day - 1).focus();
				}
				break;
			}
			case 'ArrowDown': {
				let nextLogicCell = findNextInColumn(
					currLogicCell.col,
					currLogicCell.day
				);

				if (nextLogicCell) {
					getCellBtnEl(nextLogicCell.day - 1).focus();
				}
				break;
			}
			case 'ArrowLeft': {
				let nextLogicCell = findPrevInRow(
					currLogicCell.row,
					currLogicCell.day
				);

				if (!nextLogicCell) {
					nextLogicCell = findPrevAvailable(currLogicCell.day);
				}

				if (nextLogicCell) {
					getCellBtnEl(nextLogicCell.day - 1).focus();
				}
				break;
			}
		}
	}

	// HEADER BUTTON ACTIONS
	const yearDecrement = e => {
		cellsRefs = [];
		const timestamp = shownDate().getTime() - 1000 * 60 * 60 * 24 * 365.25;
		setShownDate(new Date(timestamp));
	};
	const monthDecrement = e => {
		cellsRefs = [];
		const currentDay = shownDate().getDate(),
			currentMonth = shownDate().getMonth(),
			currentYear = shownDate().getFullYear();

		const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;

		const prevDate = new Date(
			prevMonth === 11 ? currentYear - 1 : currentYear,
			prevMonth,
			currentDay
		);

		setShownDate(prevDate);
	};
	const monthIncrement = e => {
		cellsRefs = [];

		const currentDay = shownDate().getDate(),
			currentMonth = shownDate().getMonth(),
			currentYear = shownDate().getFullYear();

		const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;

		const lastDayInMonth = new Date(
			// prettier-ignore
			new Date(
               currentMonth === 11 ? currentYear + 1 : currentYear,
               nextMonth,
               1
           ).getTime() - 1000 * 60
		).getDate();

		const nextDay =
			currentDay < lastDayInMonth ? currentDay : lastDayInMonth;

		const nextDate = new Date(
			nextMonth === 0 ? currentYear + 1 : currentYear,
			nextMonth,
			nextDay
		);

		setShownDate(nextDate);
	};
	const yearIncrement = e => {
		cellsRefs = [];
		const timestamp = shownDate().getTime() + 1000 * 60 * 60 * 24 * 365.25;
		setShownDate(new Date(timestamp));
	};

	// TRANSITIONS
	const enterTransition = (el, done) => {
		// push it left only if too close from the edge
		const isLeft = el.getBoundingClientRect().x < window.innerWidth - 300;

		el.classList.add(isLeft ? 'left' : 'right');
	};
	const exitTransition = (el, done) => {
		const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: 200,
		});
		a.finished.then(done);
	};

	createEffect(() => {
		console.log({ shownDate: shownDate() });

		if (!isOpen()) {
			cellsRefs = [];
		} else {
			cellsLogicGrid = [];

			for (let cell of cellsRefs) {
				const { disabled, grid_pos, grid_col, grid_row, day, weekday } =
					cell.dataset;

				const cellInfo = {
					pos: Number(grid_pos),
					col: Number(grid_col),
					row: Number(grid_row),
					day: Number(day),
					weekday: Number(weekday),
					disabled: disabled === 'true' ? true : false,
				};

				cellsLogicGrid.push(cellInfo);
			}
		}
	});

	createEffect(() => {
		if (props.value) {
			clearTimeout(timeout);
			labelRef.classList.add('is-focused');
			outlineRef.classList.add('is-focused');
			setInputFocused(true);
		}
	});

	createEffect(() => {
		console.log(props.theme);
	});

	onMount(() => {
		inputRef.addEventListener('focusout', e => {
			if (!isValid()) {
				setHasError(true);
			}
		});
	});

	return (
		<DatePickerContainer ref={props.ref} theme={props.theme}>
			<InputField
				theme={props.theme}
				width={props.inputWidth}
				onClick={e => {
					if (props.inputDisabled) {
						setIsOpen(true);
						(cellsRefs[0].firstChild as HTMLButtonElement).focus();
					}
					inputRef.focus();
				}}
			>
				<InputWrapper
					theme={props.theme}
					cursor={
						props.disabled || props.inputDisabled
							? 'default'
							: 'text'
					}
				>
					{/* INPUT LABEL */}
					<InputLabel
						ref={labelRef}
						color={props.color}
						theme={props.theme}
						isFocused={inputFocused()}
						isDisabled={
							props.disabled ||
							(props.inputDisabled && inputRef.value.length === 0)
						}
					>
						{props.label}
					</InputLabel>

					{/* TEXT INPUT */}
					<Input
						ref={inputRef}
						type="text"
						theme={props.theme}
						placeholder={props.placeholder}
						onFocus={e => {
							clearTimeout(timeout);
							labelRef.classList.add('is-focused');
							outlineRef.classList.add('is-focused');
							setInputFocused(true);
						}}
						onBlur={e => {
							// console.log(props.value, inputRef.value.length);
							timeout = setTimeout(() => {
								if (
									props.value === null &&
									inputRef.value.length === 0
								) {
									labelRef.classList.remove('is-focused');
									outlineRef.classList.remove('is-focused');
									setInputFocused(false);
								}
							}, 300);
						}}
						onKeyDown={handleInputKeyDown}
						onInput={handleInput}
						onChange={props.onChange}
						disabled={props.disabled || props.inputDisabled}
					/>

					{/* INPUT BUTTON */}
					<InputButton
						ref={iconBtnRef}
						theme={props.theme}
						disabled={props.disabled || props.calendarDisabled}
						onClick={e => {
							setIsOpen(true);
						}}
						onKeyDown={handleIconButtonKeyDown}
					>
						{props.icon}
					</InputButton>
				</InputWrapper>

				<InputOutline
					ref={outlineRef}
					class="outline"
					theme={props.theme}
					isFocused={inputFocused()}
					color={props.color}
				/>
			</InputField>

			<HintContainer>
				<Show when={props.hint && !hasError()}>
					<HintText>{props.hint}</HintText>
				</Show>

				<Show when={hasError()}>
					<HintText>{props.errorMessage}</HintText>
				</Show>
			</HintContainer>

			<Transition onEnter={enterTransition} onExit={exitTransition}>
				<Show when={isOpen()}>
					<CalendarPopup ref={calendarPopupRef} theme={props.theme}>
						{/* CALENDAR HEADER */}
						<CalendarHeader theme={props.theme}>
							<CalendarButtonGroup theme={props.theme}>
								<Show when={!props.hideYearButtons}>
									<button
										ref={yearDecrBtn}
										onClick={yearDecrement}
										onKeyDown={handleYearDecrKeyDown}
									>
										<YEAR_DECREMENT_ICON />
									</button>
								</Show>
								<button
									ref={monthDecrBtn}
									onClick={monthDecrement}
									onKeyDown={handleMonthDecrKeyDown}
								>
									<MONTH_DECREMENT_ICON />
								</button>
							</CalendarButtonGroup>

							{/* CALENDAR MONTH YEAR */}
							<h3>{getCurrentMonthYear()}</h3>

							<CalendarButtonGroup theme={props.theme}>
								<button
									ref={monthIncrBtn}
									onClick={monthIncrement}
									onKeyDown={handleMonthIncrKeyDown}
								>
									<MONTH_INCREMENT_ICON />
								</button>
								<Show when={!props.hideYearButtons}>
									<button
										ref={yearIncrBtn}
										onClick={yearIncrement}
										onKeyDown={handleYearIncrKeyDown}
									>
										<YEAR_INCREMENT_ICON />
									</button>
								</Show>
							</CalendarButtonGroup>
						</CalendarHeader>

						{/* DATE CELLS */}
						<CalendarGrid theme={props.theme}>
							<For each={getWeekdays(props.locale, 'narrow')}>
								{weekday => (
									<WeekdayCell theme={props.theme}>
										{weekday}
									</WeekdayCell>
								)}
							</For>
							<For each={daysGrid(shownDate())}>
								{d => {
									let cellRef!: HTMLDivElement;
									let disabled = checkIsDisabled(
										d,
										props.filter,
										props.min,
										props.max
									);

									const cellElement = (
										<CalendarCell
											ref={cellRef}
											id={idMaker()}
											class="calendar-cell"
											theme={props.theme}
											color={props.color}
											data-grid_pos={d.gridPos}
											// prettier-ignore
											data-grid_row={Math.floor(d.gridPos / 7 )}
											data-grid_col={d.gridPos % 7}
											data-day={d.day}
											data-weekday={d.weekday}
											data-disabled={disabled}
											onClick={e => handleCellClick(d)}
											onKeyDown={e =>
												handleCellKeyDown(e, d)
											}
											isVisible={isCurrentMonth(
												d.date,
												shownDate()
											)}
											isSelected={
												!!props.value &&
												isSameDate(d.date, props.value)
											}
											disabled={disabled}
										>
											<button disabled={disabled}>
												{d.day}
											</button>
										</CalendarCell>
									);

									d.date.getMonth() ===
										shownDate().getMonth() &&
										cellsRefs.push(cellRef);

									// console.log({ cellElement });

									return cellElement;
								}}
							</For>
						</CalendarGrid>
					</CalendarPopup>
				</Show>
			</Transition>

			<Show when={isOpen()}>
				<Overlay
					onClick={e => {
						setIsOpen(false);
					}}
				/>
			</Show>
		</DatePickerContainer>
	);
}
