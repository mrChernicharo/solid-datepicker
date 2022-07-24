import {
	Component,
	createRenderEffect,
	createSignal,
	For,
	JSXElement,
	Ref,
	Show,
} from "solid-js";
import { Portal } from "solid-js/web";
import { DatePickerType } from "../App";
import { getDaysGrid } from "../utils/helpers";
import { getDateFormat } from "../utils/algo.js";
import "./datepicker_v2.css";

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
	monthButtons: boolean;
	yearButtons: boolean;
	locale: string;
	type: DatePickerType;
	touchUIMode: boolean;
	calendarOnly: boolean; // no input, calendar onl;
}

export default function DatePicker_v2(props: Props) {
	let inputRef, labelRef, outlineRef, calendarPopupRef, cellsRefs;

	const dateFormat = getDateFormat(props.value, props.locale, props.delimiter);
	const dateSchema = dateFormat.replaceAll(props.delimiter, ""); // YMD | MDY | DMY
	// console.log({ dateFormat, dateSchema });

	const [isOpen, setIsOpen] = createSignal(false);
	const [shownDate, setShownDate] = createSignal(
		props.initialDate || props.value || new Date()
	);
	// const [selectedDate, setSelectedDate] = createSignal(props.initialDate || new Date());

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

	createRenderEffect(() => console.log(shownDate()));

	return (
		<div class="date-picker" ref={props.ref} onClick={e => {}}>
			<div class="date-input-field" onClick={e => inputRef.focus()}>
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
							// if (
							// 	!inputRef.value ||
							// 	(inputRef.value &&
							// 		!labelRef.classList.contains("is-focused"))
							// )
							// {
							labelRef.classList.add("is-focused");
							outlineRef.classList.add("is-focused");
							// }
						}}
						onBlur={e => {
							console.log({ value: props.value, input: inputRef.value });
							if (!props.value) {
								// if (!inputRef.value) {
								labelRef.classList.remove("is-focused");
								outlineRef.classList.remove("is-focused");
							}
						}}
						onInput={e => {
							let v = e.currentTarget.value;

							if (!v) return props.onDateSelected(null);

							if (props.applyMask) {
								let digitsAndDelimiterRegex, dayMonthRegex, yearRegex;
								let delimiter = props.delimiter;
								digitsAndDelimiterRegex = new RegExp(
									`[^${delimiter}0-9]`
								);

								v = v.replace(digitsAndDelimiterRegex, "");

								if (dateSchema === "YMD") {
									// TODO yyyy-mm-dd mask:
									yearRegex = /(\d{4})(\d)/;
									dayMonthRegex = new RegExp(
										`(\\d{4}${delimiter}\\d{2})(\\d)`,
										"g"
									);

									v = v.replace(yearRegex, `$1${delimiter}$2`);
									v = v.replace(dayMonthRegex, `$1${delimiter}$2`);
								} else {
									dayMonthRegex = new RegExp(/(\d{2})(\d)/);
									yearRegex = new RegExp(
										`(\\d+${delimiter}\\d+${delimiter})(\\d)`
									);

									// prettier-ignore
									v = v.length < 7 ? v.replace(dayMonthRegex, `$1${delimiter}$2`) : v;

									v = v.replace(yearRegex, "$1$2");
								}
								v = v.length > 10 ? v.slice(0, 10) : v;
							}

							e.currentTarget.value = v;

							if (isValidDate(v)) {
								const { year, month, day } = parseDateString(v);
								const date = new Date(
									new Date(year, month, day).setFullYear(year)
								);

								console.log("ValidDate", { v, date });

								props.onDateSelected(date);
							} else {
								// set error???
								console.log("invalidDate", { v });
								props.onDateSelected(null);
							}

							props.onInput(e);
						}}
						onChange={props.onChange}
						// value={props.value.toLocaleDateString(props.locale)}
					/>
					<button
						class="input-icon"
						onClick={e => {
							setIsOpen(true);
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

			<Show when={isOpen()}>
				<div ref={calendarPopupRef} class="calendar-popup">
					<header class="calendar-header">
						<h3>{props.value?.toLocaleDateString(props.locale)}</h3>
					</header>

					<div class="calendar-grid">
						<For each={daysGrid(props.value || new Date())}>
							{d => {
								let cellsRef;
								const cellElement = (
									<div
										ref={cellsRef}
										id={d.date.toLocaleDateString(props.locale)}
										class="calendar-cell"
										onClick={e => {
											inputRef.focus();
											inputRef.value = d.dateStr;
											props.onDateSelected(d.date);

											if (props.closeAfterClick) {
												setIsOpen(false);
											}
										}}>
										{d.day}
									</div>
								);

								return cellElement;
							}}
						</For>
					</div>
				</div>
			</Show>

			<Show when={isOpen()}>
				<Portal
					children={
						<div
							class="date-picker-overlay"
							onClick={e => setIsOpen(false)}></div>
					}
				/>
			</Show>
		</div>
	);
}
