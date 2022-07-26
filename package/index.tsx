import { createSignal, For, JSXElement, mergeProps, Show } from "solid-js";
import {
	getDaysGrid,
	getWeekdays,
	idMaker,
	isCurrentMonth,
	DatePickerType,
	isSameDate,
	getDateFormat,
	maskInput,
} from "./helpers";
import "./style.css";
import { Transition } from "solid-transition-group";
import {
	DEFAULT_ICON,
	MONTH_DECREMENT_ICON,
	MONTH_INCREMENT_ICON,
	YEAR_DECREMENT_ICON,
	YEAR_INCREMENT_ICON,
} from "./icons";

const bg = "#3c3b46";

const DEFAULT_PROPS: Props = {
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

interface Props {
	ref: any;
	value: Date | null;
	color?: string;
	icon?: JSXElement;
	hint?: string;
	initialDate?: Date;
	min?: Date | null;
	max?: Date | null;
	delimiter?: string;
	inputWidth?: number;
	filter?: (d: Date) => boolean;
	onDateSelected: (d: Date | null) => void; // both input and calenda;
	onInput: (e: any) => void; // input input;
	onChange?: (e: any) => void; // input chang;
	dateClass?: (d: Date) => string;
	label?: string;
	placeholder?: string;
	applyMask?: boolean;
	disabled?: boolean;
	inputDisabled?: boolean;
	calendarDisabled?: boolean;
	closeAfterClick?: boolean;
	showYearButtons?: boolean;
	locale?: string;
	type?: DatePickerType;
	touchUIMode?: boolean;
	calendarOnly?: boolean; // no input, calendar onl;
}

export default function DatePicker(props: Props) {
	props = mergeProps(DEFAULT_PROPS, props);

	let inputRef, labelRef, outlineRef, calendarPopupRef, cellsRefs;
	let timeout;
	const id = `calendar-popup-${idMaker()}`;

	const dateFormat = getDateFormat(
		props.value || new Date(),
		props.locale || "en",
		props.delimiter || "/"
	);
	const dateSchema = dateFormat.replaceAll(props.delimiter || "/", "") as
		| "DMY"
		| "MDY"
		| "YMD"; // YMD | MDY | DMY

	const currentMonthYear = () =>
		(shownDate() || new Date()).toLocaleDateString(props.locale, {
			month: "short",
			year: "numeric",
		});

	const [isOpen, setIsOpen] = createSignal(false);
	const [shownDate, setShownDate] = createSignal(
		props.initialDate || props.value || new Date()
	);
	const [inputFocused, setInputFocused] = createSignal(false);

	const daysGrid = (date: Date) => getDaysGrid(date, props.locale, props.delimiter);

	const parseDateString = (str: string) => {
		const schema = {
			Y: "year",
			M: "month",
			D: "day",
		};
		const values = {
			day: "",
			month: "",
			year: "",
		};
		let splitValues = str.split(props.delimiter || "/");

		for (let i = 0; i < 3; i++) {
			values[schema[dateSchema[i]]] = splitValues[i];
		}
		const { year, month, day } = values;

		return { year: +year, month: +month - 1, day: +day };
	};

	const isValidDate = (str: string) => {
		const { year, month, day } = parseDateString(str);

		if (day > 31) return false;
		if (month > 11) return false;

		const date = new Date(new Date(year, month, day).setFullYear(year));

		if (!isNaN(date.getTime())) return true;
	};

	function handleInput(e) {
		let v = e.currentTarget.value;

		if (!v) return props.onDateSelected(null);

		if (props.applyMask) {
			v = maskInput(v, dateSchema, props.delimiter || "/");
			v = v.length > 10 ? v.slice(0, 10) : v;
		}

		e.currentTarget.value = v;

		if (isValidDate(v)) {
			const { year, month, day } = parseDateString(v);
			const date = new Date(new Date(year, month, day).setFullYear(year));

			props.onDateSelected(date);
			setShownDate(date);
		} else {
			// set error???
			// console.log("invalidDate", { v });
			props.onDateSelected(null);
		}

		props.onInput(e);
	}

	const yearDecrement = e => {
		const timestamp = shownDate().getTime() - 1000 * 60 * 60 * 24 * 365.25;
		setShownDate(new Date(timestamp));
	};

	const monthDecrement = e => {
		const currentDay = shownDate().getDate();
		const currentMonth = shownDate().getMonth();
		const currentYear = shownDate().getFullYear();

		const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;

		const prevDate = new Date(
			prevMonth === 11 ? currentYear - 1 : currentYear,
			prevMonth,
			currentDay
		);

		setShownDate(prevDate);
	};
	const monthIncrement = e => {
		const currentDay = shownDate().getDate();
		const currentMonth = shownDate().getMonth();
		const currentYear = shownDate().getFullYear();

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
		const timestamp = shownDate().getTime() + 1000 * 60 * 60 * 24 * 365.25;
		setShownDate(new Date(timestamp));
	};
	return (
		<div class="date-picker" ref={props.ref} onClick={e => {}}>
			<div
				class="date-input-field"
				style={{ width: props.inputWidth + "px" }}
				onClick={e => {
					inputRef.focus();
				}}>
				<label class="date-input-wrapper">
					<span
						ref={labelRef!}
						class="input-label"
						style={{
							color: inputFocused() ? props.color : "white",
						}}>
						{props.label}
					</span>
					<input
						ref={inputRef!}
						class="date-input"
						type="text"
						placeholder={props.placeholder}
						onFocus={e => {
							clearTimeout(timeout);
							if (!inputFocused()) {
								labelRef.classList.add("is-focused");
								outlineRef.classList.add("is-focused");
								setInputFocused(true);
							}
						}}
						onBlur={e => {
							if (!props.value && !inputRef.value.length) {
								timeout = setTimeout(() => {
									labelRef.classList.remove("is-focused");
									outlineRef.classList.remove("is-focused");
									setInputFocused(false);
								}, 300);
							}
						}}
						onInput={handleInput}
						onChange={props.onChange}
					/>
					<button
						class="input-icon"
						onClick={e => {
							setIsOpen(true);
						}}
						onKeyDown={e => {
							if (e.code === "Enter") {
								e.preventDefault(); // prevent input focus
								setIsOpen(true);
							}
						}}>
						{props.icon}
					</button>
				</label>

				<div
					ref={outlineRef}
					class="date-input-outline"
					style={{ background: inputFocused() ? props.color : bg }}></div>
			</div>

			<div class="hint-container">
				<Show when={props.hint}>
					<small class="hint">{props.hint}</small>
				</Show>
			</div>

			<Transition
				onEnter={(el, done) => {
					// push it left only if too close from the edge
					const isLeft = el.getBoundingClientRect().x < window.innerWidth - 270;

					el.classList.add(isLeft ? "left" : "right");
				}}
				onExit={(el, done) => {
					const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
						duration: 200,
					});
					a.finished.then(done);
				}}>
				<Show when={isOpen()}>
					<div ref={calendarPopupRef} id={id} class={`calendar-popup`}>
						<header class="calendar-header">
							<div class="calendar-btn-group">
								<Show when={props.showYearButtons}>
									<button onClick={yearDecrement}>
										{/* <FaSolidAngleDoubleLeft size={16} /> */}
										<YEAR_DECREMENT_ICON />
									</button>
								</Show>
								<button onClick={monthDecrement}>
									{/* <FaSolidAngleLeft size={16} /> */}
									<MONTH_DECREMENT_ICON />
								</button>
							</div>
							<h3>{currentMonthYear()}</h3>

							<div class="calendar-btn-group">
								<button onClick={monthIncrement}>
									{/* <FaSolidAngleRight size={16} /> */}
									<MONTH_INCREMENT_ICON />
								</button>
								<Show when={props.showYearButtons}>
									<button onClick={yearIncrement}>
										{/* <FaSolidAngleDoubleRight size={16} /> */}
										<YEAR_INCREMENT_ICON />
									</button>
								</Show>
							</div>
						</header>

						<div class="calendar-grid">
							<For each={getWeekdays(props.locale, "narrow")}>
								{weekDay => <div class="weekday-cell">{weekDay}</div>}
							</For>
							<For each={daysGrid(shownDate() || new Date())}>
								{d => {
									let cellsRef;
									const cellElement = (
										<div
											ref={cellsRef}
											id={d.date.toLocaleDateString(props.locale)}
											// prettier-ignore
											class={`
                                                calendar-cell 
                                                ${isCurrentMonth(d.date, shownDate()) ? "current-month-cell" : "" }
                                                ${props.value ? isSameDate(d.date, props.value) ? "selected-date" : "" : ""}
                                            `}
											style={{
												background:
													props.value &&
													isSameDate(d.date, props.value)
														? props.color
														: bg,
											}}
											onClick={e => {
												inputRef.focus();
												inputRef.value = d.dateStr;
												props.onDateSelected(d.date);

												if (props.closeAfterClick) {
													setIsOpen(false);
												}
											}}>
											<button>{d.day}</button>
										</div>
									);

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
