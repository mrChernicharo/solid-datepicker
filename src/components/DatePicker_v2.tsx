import {
	Component,
	createEffect,
	createRenderEffect,
	createSignal,
	For,
	JSXElement,
	Ref,
	Show,
} from "solid-js";
import { Portal } from "solid-js/web";
import { DatePickerType } from "../App";
import {
	getDaysGrid,
	getWeekdays,
	idMaker,
	isCurrentMonth,
	isSameDate,
} from "../utils/helpers";
import { getDateFormat } from "../utils/algo.js";
import "./datepicker_v2.css";
import {
	FaSolidAngleDoubleLeft,
	FaSolidAngleDoubleRight,
	FaSolidAngleLeft,
	FaSolidAngleRight,
} from "solid-icons/fa";
import { Transition } from "solid-transition-group";

// dateClass={higlight20thDay}
interface Props {
	ref: any;
	value: Date | null;
	color: string;
	icon: JSXElement;
	hint: string;
	initialDate: Date;
	min: Date;
	max: Date;
	delimiter: string;
	width: number;
	filter: (d: Date) => boolean;
	onDateSelected: (d: Date | null) => void; // both input and calenda;
	onInput: (e: any) => void; // input input;
	onChange: (e: any) => void; // input chang;
	dateClass: (d: Date) => string;
	label: string;
	placeholder: string;
	applyMask: boolean;
	disabled: boolean;
	inputDisabled: boolean;
	calendarDisabled: boolean;
	closeAfterClick: boolean;
	showYearButtons: boolean;
	locale: string;
	type: DatePickerType;
	touchUIMode: boolean;
	calendarOnly: boolean; // no input, calendar onl;
}

export default function DatePicker_v2(props: Props) {
	let inputRef, labelRef, outlineRef, calendarPopupRef, cellsRefs;
	let timeout;
	const id = `calendar-popup-${idMaker()}`;

	const dateFormat = getDateFormat(
		props.value || new Date(),
		props.locale,
		props.delimiter
	);
	const dateSchema = dateFormat.replaceAll(props.delimiter, ""); // YMD | MDY | DMY
	const currentMonthYear = () =>
		(shownDate() || new Date()).toLocaleDateString(props.locale, {
			month: "short",
			year: "numeric",
		});

	const [isOpen, setIsOpen] = createSignal(false);
	const [shownDate, setShownDate] = createSignal(
		props.initialDate || props.value || new Date()
	);

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
		let splitValues = str.split(props.delimiter);

		for (let i = 0; i < 3; i++) {
			values[schema[dateSchema[i]]] = splitValues[i];
		}
		const { year, month, day } = values;
		// console.log({
		// 	// year,
		// 	// month,
		// 	// day,
		// 	splitValues,
		// 	values,
		// 	dateSchema,
		// });

		return { year: +year, month: +month - 1, day: +day };
	};

	const isValidDate = (str: string) => {
		const { year, month, day } = parseDateString(str);

		// console.log("isValidDate", { str, dateSchema, year, month, day });

		if (day > 31) return false;
		if (month > 11) return false;

		const date = new Date(new Date(year, month, day).setFullYear(year));

		if (!isNaN(date.getTime())) return true;
	};

	createRenderEffect(() => {
		// 	if (props.value && props.value.getTime() !== shownDate().getTime()) {
		// 		console.log("shownDate", shownDate().toLocaleDateString(props.locale));
		// 	}
		console.log(isOpen());
	});

	function handleInput(e) {
		let v = e.currentTarget.value;

		if (!v) return props.onDateSelected(null);

		if (props.applyMask) {
			let digitsAndDelimiterRegex, dayMonthRegex, yearRegex;
			let delimiter = props.delimiter;
			digitsAndDelimiterRegex = new RegExp(`[^${delimiter}0-9]`);

			v = v.replace(digitsAndDelimiterRegex, "");

			if (dateSchema === "YMD") {
				// TODO yyyy-mm-dd mask:
				yearRegex = /(\d{4})(\d)/;
				dayMonthRegex = new RegExp(`(\\d{4}${delimiter}\\d{2})(\\d)`, "g");

				v = v.replace(yearRegex, `$1${delimiter}$2`);
				v = v.replace(dayMonthRegex, `$1${delimiter}$2`);
			} else {
				dayMonthRegex = new RegExp(/(\d{2})(\d)/);
				yearRegex = new RegExp(`(\\d+${delimiter}\\d+${delimiter})(\\d)`);

				// prettier-ignore
				v = v.length < 7 ? v.replace(dayMonthRegex, `$1${delimiter}$2`) : v;

				v = v.replace(yearRegex, "$1$2");
			}
			v = v.length > 10 ? v.slice(0, 10) : v;
		}

		e.currentTarget.value = v;

		if (isValidDate(v)) {
			const { year, month, day } = parseDateString(v);
			const date = new Date(new Date(year, month, day).setFullYear(year));

			// console.log("ValidDate", { v, date });

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
			<div class="date-input-field" onClick={e => {}}>
				<label class="date-input-wrapper">
					<span ref={labelRef!} class="input-label">
						{props.label}
					</span>
					<input
						ref={inputRef!}
						class="date-input"
						type="text"
						placeholder={props.placeholder}
						onFocus={e => {
							console.log(labelRef.classList.contains("is-focused"));

							if (!labelRef.classList.contains("is-focused")) {
								clearTimeout(timeout);
								labelRef.classList.add("is-focused");
								outlineRef.classList.add("is-focused");
							}
						}}
						onBlur={e => {
							if (!props.value && !inputRef.value.length) {
								timeout = setTimeout(() => {
									labelRef.classList.remove("is-focused");
									outlineRef.classList.remove("is-focused");
								}, 300);
							}
						}}
						onInput={handleInput}
						onChange={props.onChange}
						// value={props.value.toLocaleDateString(props.locale)}
					/>
					<button
						class="input-icon"
						onClick={e => {
							setIsOpen(true);
							// inputRef.focus();
						}}>
						{props.icon}
					</button>
				</label>

				<div ref={outlineRef} class="date-input-outline"></div>
			</div>

			<div class="hint-container">
				<Show when={props.hint}>
					<small class="hint">{props.hint}</small>
				</Show>
			</div>

			<Transition
				onEnter={(el, done) => {
					const isLeft = el.getBoundingClientRect().x < window.innerWidth / 2;

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
										<FaSolidAngleDoubleLeft size={16} />
									</button>
								</Show>
								<button onClick={monthDecrement}>
									<FaSolidAngleLeft size={16} />
								</button>
							</div>
							<h3>{currentMonthYear()}</h3>

							<div class="calendar-btn-group">
								<button onClick={monthIncrement}>
									<FaSolidAngleRight size={16} />
								</button>
								<Show when={props.showYearButtons}>
									<button onClick={yearIncrement}>
										<FaSolidAngleDoubleRight size={16} />
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
						// console.log(e.bubbles);
						// console.log(e.composedPath());
					}}></div>
				{/* <Portal
					children={
						
					}
				/> */}
			</Show>
		</div>
	);
}

// (
//     e: MouseEvent & {
//         currentTarget: HTMLDivElement;
//         target: Element;
//     }
// )
