import { Component, createSignal, For, JSXElement, Ref, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { DatePickerType } from "../App";
import { getDaysGrid } from "../utils/helpers";
import "./datepicker_v2.css";

// dateClass={higlight20thDay}
interface Props {
	ref: any;
	color: string;
	icon: JSXElement;
	hint: string;
	initialDate: Date;
	min: Date;
	max: Date;
	filter: (d: Date) => boolean;
	onDateSelected: (d: Date) => void; // both input and calenda;
	onInput: (d: Date) => void; // input input;
	onChange: (d: Date) => void; // input chang;
	dateClass: (d: Date) => string;
	label: string;
	placeholder: string;
	disabled: boolean;
	inputDisabled: boolean;
	calendarDisabled: boolean;
	monthButtons: boolean;
	yearButtons: boolean;
	locale: string;
	type: DatePickerType;
	touchUIMode: boolean;
	calendarOnly: boolean; // no input, calendar onl;
}

export default function DatePicker_v2(props: Props) {
	let inputRef, labelRef, outlineRef;

	const [isOpen, setIsOpen] = createSignal(false);
	const [shownDate, setShownDate] = createSignal(props.initialDate || new Date());
	const [selectedDate, setSelectedDate] = createSignal(props.initialDate || new Date());

	const daysGrid = (date: Date) => getDaysGrid(date);

	return (
		<div class="date-picker" ref={props.ref} onClick={e => console.log(props.ref)}>
			<div class="date-input-field" onClick={e => inputRef.focus()}>
				<label class="date-input-wrapper">
					<span ref={labelRef!} class="input-label">
						{props.label}
					</span>
					<input
						ref={inputRef!}
						class="date-input"
						type="text"
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
					/>
					<button class="input-icon" onClick={e => setIsOpen(true)}>
						{props.icon}
					</button>
				</label>

				<small ref={outlineRef} class="date-input-outline"></small>
			</div>

			<Show when={props.hint}>
				<div class="hint">{/* <span>{props.hint}</span> */}</div>
			</Show>

			<Show when={isOpen()}>
				<div class="calendar-pane">
					<For each={daysGrid(shownDate())}>
						{d => <div class="calendar-cell">{d.day}</div>}
					</For>
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
