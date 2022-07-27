import { createEffect, createSignal, For, mergeProps, onMount, Show } from "solid-js";
import { Transition } from "solid-transition-group";
import "./style.css";
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
} from "../utils/helpers";
import {
	DEFAULT_ICON,
	MONTH_DECREMENT_ICON,
	MONTH_INCREMENT_ICON,
	YEAR_DECREMENT_ICON,
	YEAR_INCREMENT_ICON,
} from "./icons";

const bg = "#3c3b46";
const outlineColor = "rgba(255, 255, 255, 0.65)";

const DEFAULT_PROPS: DatepickerProps = {
	ref: null,
	value: null,
	color: "#009898",
	icon: DEFAULT_ICON,
	hint: "",
	initialDate: new Date(),
	min: null,
	max: null,
	delimiter: "/",
	inputWidth: 270,
	filter: (d: Date) => false,
	onDateSelected: (d: Date | null) => d, // both input and calenda,
	onInput: (e: any) => e, // input input,
	onChange: (e: any) => e, // input chang,
	dateClass: (d: Date) => "",
	label: "date picker",
	placeholder: "placeholder",
	applyMask: true,
	disabled: false,
	inputDisabled: false,
	calendarDisabled: false,
	closeAfterClick: false,
	showYearButtons: false,
	locale: "en",
	type: "datePicker",
	touchUIMode: false,
	calendarOnly: false, // no input, calendar onl;
};

export default function DatePicker(props: DatepickerProps) {
	props = mergeProps(DEFAULT_PROPS, props);

	let inputRef, labelRef, outlineRef, calendarPopupRef, iconBtnRef;
	let monthDecrBtn, monthIncrBtn, yearDecrBtn, yearIncrBtn;
	let timeout;
	let grid: DateCell[] = [];
	let cellsRefs: any = [];
	let firstSaturday, lastSunday;
	// const id = `calendar-popup-${idMaker()}`;

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
		return dateFormat.replaceAll(props.delimiter || "/", "") as DateSchema; // YMD | }MDY | DMY
	};
	const getCurrentMonthYear = () => {
		return (shownDate() || new Date()).toLocaleDateString(props.locale, {
			month: "short",
			year: "numeric",
		});
	};
	const isValidDate = (str: string) => {
		const { year, month, day } = parseDateString(
			str,
			getDateSchema(),
			props.delimiter
		);

		if (day > 31) return false;
		if (month > 11) return false;

		const date = new Date(new Date(year, month, day).setFullYear(year));

		if (!isNaN(date.getTime())) return true;
	};

	const getCellWeekday = el => {
		const day = +el.firstChild.textContent;

		if (!day) console.error("getCellWeekday errored out!");

		return grid.findIndex(
			o =>
				o.day === day &&
				o.date.getTime() ===
					new Date(
						shownDate().getFullYear(),
						shownDate().getMonth(),
						day
					).getTime()
		);
	};
	const daysGrid = (date: Date | null): DateCell[] => {
		let d = date || new Date();
		grid = getDaysGrid(d, props.locale, props.delimiter);
		return grid;
	};

	function handleInput(e) {
		let v = e.currentTarget.value;

		if (!v) return props.onDateSelected(null);

		if (props.applyMask) {
			v = maskInput(v, getDateSchema(), props.delimiter);
			v = v.length > 10 ? v.slice(0, 10) : v;

			e.currentTarget.value = v;

			if (isValidDate(v)) {
				const { year, month, day } = parseDateString(
					v,
					getDateSchema(),
					props.delimiter
				);
				const date = new Date(new Date(year, month, day).setFullYear(year));

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
		props.onInput(e);
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

	function handleInputKeyDown(e) {
		if (e.code === "Escape") {
			setIsOpen(false);
		}
		if (e.code === "Enter") {
			if (props.disabled || props.calendarDisabled) return;
			setIsOpen(!isOpen());
		}

		if (e.code === "ArrowDown") {
			if (props.disabled || props.calendarDisabled) return;

			if (!isOpen()) {
				setIsOpen(true);
			}
			inputRef.blur();
			cellsRefs[0].firstChild.focus();
		}
	}
	function handleMonthIncrKeyDown(e: KeyboardEvent) {
		switch (e.code) {
			case "Escape": {
				setIsOpen(false);
			}
			case "ArrowUp": {
				setIsOpen(false);
				if (props.inputDisabled) {
					iconBtnRef.focus();
				} else {
					inputRef.focus();
				}
				break;
			}
			case "ArrowLeft": {
				monthDecrBtn.focus();
				break;
			}
			case "ArrowRight": {
				yearIncrBtn && yearIncrBtn.focus();
				break;
			}
			case "ArrowDown": {
				// TODO: Account for disabled cells

				switch (getCellWeekday(cellsRefs[0])) {
					case 0:
						cellsRefs[5].firstChild.focus();
						break;
					case 1:
						cellsRefs[4].firstChild.focus();
						break;
					case 2:
						cellsRefs[3].firstChild.focus();
						break;
					case 3:
						cellsRefs[2].firstChild.focus();
						break;
					case 4:
						cellsRefs[1].firstChild.focus();
						break;
					case 5:
					case 6:
						cellsRefs[0].firstChild.focus();
						break;
				}
			}
		}
	}
	function handleMonthDecrKeyDown(e: KeyboardEvent) {
		switch (e.code) {
			case "Escape": {
				setIsOpen(false);
			}
			case "ArrowUp": {
				setIsOpen(false);
				if (props.inputDisabled) {
					iconBtnRef.focus();
				} else {
					inputRef.focus();
				}
				break;
			}
			case "ArrowLeft": {
				yearDecrBtn && yearDecrBtn.focus();
				break;
			}
			case "ArrowRight": {
				monthIncrBtn.focus();
				break;
			}
			case "ArrowDown": {
				// TODO: Account for disabled cells

				switch (getCellWeekday(cellsRefs[0])) {
					case 0:
						cellsRefs[1].firstChild.focus();
						break;
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:
					case 6:
						cellsRefs[0].firstChild.focus();
						break;
				}
			}
		}
	}
	function handleYearDecrKeyDown(e: KeyboardEvent) {
		switch (e.code) {
			case "Escape": {
				setIsOpen(false);
			}
			case "ArrowUp": {
				setIsOpen(false);
				if (props.inputDisabled) {
					iconBtnRef.focus();
				} else {
					inputRef.focus();
				}
				break;
			}
			case "ArrowRight": {
				monthDecrBtn.focus();
				break;
			}
			case "ArrowDown": {
				// TODO: Account for disabled cells

				cellsRefs[0].firstChild.focus();
			}
		}
	}
	function handleYearIncrKeyDown(e: KeyboardEvent) {
		// console.log(document.activeElement);

		switch (e.code) {
			case "Escape": {
				setIsOpen(false);
			}
			case "ArrowUp": {
				setIsOpen(false);
				if (props.inputDisabled) {
					iconBtnRef.focus();
				} else {
					inputRef.focus();
				}
				break;
			}
			case "ArrowLeft": {
				monthIncrBtn.focus();
				break;
			}
			case "ArrowDown": {
				// TODO: Account for disabled cells

				switch (getCellWeekday(cellsRefs[0])) {
					case 0:
						cellsRefs[6].firstChild.focus();
					case 1:
						cellsRefs[5].firstChild.focus();
						break;
					case 2:
						cellsRefs[4].firstChild.focus();
						break;
					case 3:
						cellsRefs[3].firstChild.focus();
						break;
					case 4:
						cellsRefs[2].firstChild.focus();
						break;
					case 5:
						cellsRefs[1].firstChild.focus();
						break;
					case 6:
						cellsRefs[0].firstChild.focus();
						break;
				}
			}
		}
	}
	function handleCellKeyDown(e: KeyboardEvent, d: DateCell) {
		const cellIndex: number = cellsRefs.findIndex(
			ref => ref.firstChild.textContent === d.day.toString()
		);

		lastSunday = (grid as any).findLast(cell => cell.weekday === 0).day;
		firstSaturday = (grid as any).find(cell => cell.weekday === 6).day;
		const lastCell = cellsRefs.at(-1);

		// console.log({
		// 	// 	d,
		// 	// 	lastCell,
		// 	// 	currCell: e.currentTarget,
		// 	cellIndex,
		// 	grid,
		// 	g: grid[cellIndex],
		// 	// cellsRefs,
		// 	// 	// firstSaturday,
		// 	// 	// lastSunday,
		// });

		switch (e.code) {
			case "Escape": {
				inputRef.focus();
				setIsOpen(false);
				break;
			}
			case "Tab": {
				if (cellIndex + 1 === +lastCell.firstChild.textContent) {
					setIsOpen(false);
				}
				break;
			}
			case "ArrowUp": {
				if (cellIndex - 7 < 0) {
					if (cellIndex >= firstSaturday) {
						cellsRefs[0].firstChild.focus();
					} else {
						// console.log({
						// 	weekday: d.weekday,
						// 	// 	lastCell,
						// 	// 	currCell: e.currentTarget,
						// 	cellIndex,
						// 	// grid,
						// 	// g: grid[cellIndex],
						// 	// cellsRefs,
						// 	// 	// firstSaturday,
						// 	// 	// lastSunday,
						// });

						switch (d.weekday) {
							case 0: {
								props.showYearButtons
									? yearDecrBtn.focus()
									: monthDecrBtn.focus();
								break;
							}
							case 1:
							case 2: {
								monthDecrBtn.focus();
								break;
							}
							case 3:
							case 4:
							case 5: {
								monthIncrBtn.focus();
								break;
							}
							case 6: {
								props.showYearButtons
									? yearIncrBtn.focus()
									: monthIncrBtn.focus();
								break;
							}
						}
					}
				} else {
					cellsRefs[cellIndex - 7].firstChild.focus();
				}
				break;
			}
			case "ArrowRight": {
				if (cellIndex + 1 >= +lastCell.firstChild.textContent) return;
				if (d.weekday < 6) cellsRefs[cellIndex + 1].firstChild.focus();
				break;
			}
			case "ArrowDown": {
				if (cellIndex + 7 >= +lastCell.firstChild.textContent) {
					if (cellIndex < lastSunday) {
						lastCell.firstChild.focus();
					}
				} else {
					cellsRefs[cellIndex + 7].firstChild.focus();
				}
				break;
			}
			case "ArrowLeft": {
				if (cellIndex - 1 < 0) return;
				if (d.weekday > 0) cellsRefs[cellIndex - 1].firstChild.focus();
				break;
			}
			default:
		}
	}

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

		const nextDay = currentDay < lastDayInMonth ? currentDay : lastDayInMonth;

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

	function checkIsDisabled(d: DateCell) {
		let disabled = props.filter && !props.filter(d.date);

		if (props.min && d.date < props.min) {
			disabled = true;
		}
		if (props.max && d.date > props.max) {
			disabled = true;
		}

		return disabled;
	}

	const enterTransition = (el, done) => {
		// push it left only if too close from the edge
		const isLeft = el.getBoundingClientRect().x < window.innerWidth - 300;

		el.classList.add(isLeft ? "left" : "right");
	};
	const exitTransition = (el, done) => {
		const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: 200,
		});
		a.finished.then(done);
	};

	createEffect(() => {
		if (!isOpen()) {
			cellsRefs = [];
		}
		// console.log({ activeElement: document.activeElement });
	});

	createEffect(() => {
		if (props.value) {
			clearTimeout(timeout);
			labelRef.classList.add("is-focused");
			outlineRef.classList.add("is-focused");
			setInputFocused(true);
		}
	});

	onMount(() => {
		inputRef.addEventListener("focusout", e => {
			if (!isValid()) {
				setHasError(true);
			}
			// console.log({
			// 	valid: isValid(),
			// 	error: hasError(),
			// });
		});
	});

	return (
		<div class="date-picker" ref={props.ref} onClick={e => {}}>
			<div
				class="date-input-field"
				style={{ width: props.inputWidth + "px" }}
				onClick={e => {
					if (props.inputDisabled) {
						setIsOpen(true);
						cellsRefs[0].firstChild.focus();
					}
					inputRef.focus();
				}}>
				<label
					class="date-input-wrapper"
					style={{
						cursor:
							props.disabled || props.inputDisabled ? "default" : "text",
					}}>
					{/* INPUT LABEL */}
					<span
						ref={labelRef!}
						class="input-label"
						style={{
							color:
								props.disabled ||
								(props.inputDisabled && inputRef.value.length === 0)
									? "rgba(255, 255, 255, 0.2)"
									: inputFocused()
									? props.color
									: "white",
						}}>
						{props.label}
					</span>

					{/* TEXT INPUT */}
					<input
						ref={inputRef}
						id="date-input"
						type="text"
						placeholder={props.placeholder}
						style={{
							color:
								props.inputDisabled && inputRef.value.length > 0
									? "white"
									: "",
						}}
						onFocus={e => {
							clearTimeout(timeout);
							labelRef.classList.add("is-focused");
							outlineRef.classList.add("is-focused");
							setInputFocused(true);
						}}
						onBlur={e => {
							// console.log(props.value, inputRef.value.length);
							timeout = setTimeout(() => {
								if (props.value === null && inputRef.value.length === 0) {
									labelRef.classList.remove("is-focused");
									outlineRef.classList.remove("is-focused");
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
					<button
						ref={iconBtnRef}
						disabled={props.disabled || props.calendarDisabled}
						class="input-icon"
						onClick={e => {
							setIsOpen(true);
						}}
						onKeyDown={e => {
							if (e.code === "Enter") {
								e.preventDefault(); // prevent input focus
								setIsOpen(!isOpen());
							}
							if (e.code === "ArrowDown") {
								inputRef.blur();
								setIsOpen(true);
								cellsRefs[0].firstChild.focus();
							}
						}}>
						{props.icon}
					</button>
				</label>

				<div
					ref={outlineRef}
					class="date-input-outline"
					style={{
						background: inputFocused() ? props.color : outlineColor,
					}}></div>
			</div>

			<div class="hint-container">
				<Show when={props.hint}>
					<small class="hint">{props.hint}</small>
				</Show>

				<Show when={hasError()}>
					<small>Error!!!</small>
				</Show>
			</div>

			<Transition onEnter={enterTransition} onExit={exitTransition}>
				<Show when={isOpen()}>
					<div ref={calendarPopupRef} class="calendar-popup">
						{/* CALENDAR HEADER */}
						<header class="calendar-header">
							<div class="calendar-btn-group">
								<Show when={props.showYearButtons}>
									<button
										ref={yearDecrBtn}
										onClick={yearDecrement}
										onKeyDown={handleYearDecrKeyDown}>
										<YEAR_DECREMENT_ICON />
									</button>
								</Show>
								<button
									ref={monthDecrBtn}
									onClick={monthDecrement}
									onKeyDown={handleMonthDecrKeyDown}>
									<MONTH_DECREMENT_ICON />
								</button>
							</div>
							<h3>{getCurrentMonthYear()}</h3>

							<div class="calendar-btn-group">
								<button
									ref={monthIncrBtn}
									onClick={monthIncrement}
									onKeyDown={handleMonthIncrKeyDown}>
									<MONTH_INCREMENT_ICON />
								</button>
								<Show when={props.showYearButtons}>
									<button
										ref={yearIncrBtn}
										onClick={yearIncrement}
										onKeyDown={handleYearIncrKeyDown}>
										<YEAR_INCREMENT_ICON />
									</button>
								</Show>
							</div>
						</header>

						{/* DATE CELLS */}
						<div class="calendar-grid">
							<For each={getWeekdays(props.locale, "narrow")}>
								{weekday => <div class="weekday-cell">{weekday}</div>}
							</For>
							<For each={daysGrid(shownDate())}>
								{d => {
									let cellRef;
									let disabled = checkIsDisabled(d);

									const cellElement = (
										<div
											ref={cellRef}
											id={idMaker()}
											// prettier-ignore
											classList={{ 
												"current-month-cell": isCurrentMonth(d.date, shownDate()), 
												"selected-date": !!props.value && isSameDate(d.date, props.value), 
												"disabled": disabled,
												"calendar-cell": true }}
											style={{
												background:
													props.value &&
													isSameDate(d.date, props.value)
														? props.color
														: bg,
											}}
											onClick={e => handleCellClick(d)}
											onKeyDown={e => handleCellKeyDown(e, d)}>
											<button disabled={disabled}>{d.day}</button>
										</div>
									);

									d.date.getMonth() === shownDate().getMonth() &&
										cellsRefs.push(cellRef);

									// cellRef.classList.contains("current-month-cell") &&
									// 	cellsRefs.push(cellRef);

									return cellElement;
								}}
							</For>
						</div>
					</div>
				</Show>
			</Transition>

			<Show when={isOpen()}>
				<div
					class="date-picker-overlay"
					onClick={e => {
						setIsOpen(false);
					}}></div>
			</Show>
		</div>
	);
}
