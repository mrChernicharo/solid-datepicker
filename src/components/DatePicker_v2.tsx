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
	value: Date;
	color: string;
	icon: JSXElement;
	hint: string;
	initialDate: Date;
	min: Date;
	max: Date;
	delimiter: string;
	filter: (d: Date) => boolean;
	onDateSelected: (d: Date) => void; // both input and calenda;
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
	let inputRef, labelRef, outlineRef, cellsRefs;

	const dateFormat = getDateFormat(props.value, props.locale, props.delimiter);
	console.log({ dateFormat });

	const [isOpen, setIsOpen] = createSignal(false);
	const [shownDate, setShownDate] = createSignal(
		props.initialDate || props.value || new Date()
	);
	// const [selectedDate, setSelectedDate] = createSignal(props.initialDate || new Date());

	const daysGrid = (date: Date) => getDaysGrid(date);
	const isValidDate = (str: string) => {
		// let [] = str.split(props.delimiter)
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
							if (!inputRef.value) {
								labelRef.classList.toggle("is-focused");
								outlineRef.classList.toggle("is-focused");
							}
						}}
						onBlur={e => {
							if (!inputRef.value) {
								labelRef.classList.toggle("is-focused");
								outlineRef.classList.toggle("is-focused");
							}
						}}
						onInput={e => {
							let v = e.currentTarget.value;

							if (props.applyMask) {
								let delimiter = props.delimiter;

								// prettier-ignore
								let digitsAndDelimiterRegex = new RegExp(`[^${delimiter}0-9]`);
								let dayMonthRegex = new RegExp(/(\d{2})(\d)/);
								// prettier-ignore
								let yearRegex = new RegExp(`(\d+${delimiter}\d+${delimiter})(\d)`);

								v = v.replace(digitsAndDelimiterRegex, "");
								// prettier-ignore
								v = v.length < 7 ? v.replace(dayMonthRegex, `$1${delimiter}$2`) : v;

								v = v.replace(yearRegex, "$1$2");

								v = v.length > 10 ? v.slice(0, 10) : v;
							}
							console.log(v);

							e.currentTarget.value = v;

							// if (isValidDate(v)) {
							//     props.onDateSelected(v);
							// }

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
				<div class="calendar-popup">
					<header class="calendar-header">
						<h3>{props.value.toLocaleDateString(props.locale)}</h3>
					</header>

					<div class="calendar-grid">
						<For each={daysGrid(props.value)}>
							{d => {
								let cellsRef;
								const cellElement = (
									<div
										ref={cellsRef}
										id={d.date.toLocaleDateString(props.locale)}
										class="calendar-cell"
										onClick={e => {
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
