// import { Component, createEffect, createMemo, createSignal, For, Show } from "solid-js";
import {
	FaAddressBook,
	FaCalendar,
	FaCalendarAlt,
	FaSolidCalendarAlt,
} from "solid-icons/fa";
import { createEffect } from "solid-js";
import s from "./App.module.css";
import Icon from "./assets/Icon";
import DatePicker_v1 from "./components/DatePicker_v1";
import DatePicker_v2 from "./components/DatePicker_v2";
// let lang = "en";
let lang = "pt-BR";

export type DatePickerType =
	| "monthYearPicker"
	| "datePicker"
	| "timePicker"
	| "datetimePicker"
	| "dateRange"
	| "timeRange";

const color = "#0098ae";
const minDate = new Date(2022, 5, 31);
const initialDate = new Date(2022, 6, 13);
const maxDate = new Date(2022, 8, 30);
const weekendFilter = (d: Date | null): boolean => {
	const day = (d || new Date()).getDay();
	// Prevent Saturday and Sunday from being selected.
	return day !== 0 && day !== 6;
};

const higlight20thDay = (d: Date | null) => {
	const day = (d || new Date()).getDate();

	return day === 20 ? "highlighted-20" : "";
};

export default function App() {
	let datepickerRef;
	// datepickerRef.open()
	// datepickerRef.close()

	createEffect(() => console.log({ datepickerRef }));

	return (
		<div class={s.App}>
			{/* <DatePicker_v1 /> */}
			<h1>DatePicker</h1>
			<DatePicker_v2
				ref={datepickerRef}
				type={"datePicker"}
				color={color}
				locale={lang}
				icon={<FaCalendarAlt size={16} />}
				initialDate={initialDate}
				min={minDate}
				max={maxDate}
				placeholder={"29/04/1987"}
				hint={"dd/mm/aaaa"}
				filter={weekendFilter}
				onDateSelected={console.log} // both input and calendar
				onInput={console.log} // input input
				onChange={console.log} // input change
				label="DatePicker label"
				disabled={false}
				inputDisabled={false}
				calendarDisabled={false}
				monthButtons={true}
				yearButtons={true}
				touchUIMode={false}
				calendarOnly={false} // no input, calendar only
				dateClass={higlight20thDay}
			/>

			<DatePicker_v2
				ref={datepickerRef}
				type={"datePicker"}
				color={color}
				locale={lang}
				icon={<FaCalendarAlt size={16} />}
				initialDate={initialDate}
				min={minDate}
				max={maxDate}
				placeholder={"29/04/1987"}
				hint={"dd/mm/aaaa"}
				filter={weekendFilter}
				onDateSelected={console.log} // both input and calendar
				onInput={console.log} // input input
				onChange={console.log} // input change
				label="DatePicker label"
				disabled={false}
				inputDisabled={false}
				calendarDisabled={false}
				monthButtons={true}
				yearButtons={true}
				touchUIMode={false}
				calendarOnly={false} // no input, calendar only
				dateClass={higlight20thDay}
			/>
		</div>
	);
}
