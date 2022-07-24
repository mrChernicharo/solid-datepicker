// import { Component, createEffect, createMemo, createSignal, For, Show } from "solid-js";
import {
	FaAddressBook,
	FaCalendar,
	FaCalendarAlt,
	FaSolidCalendarAlt,
} from "solid-icons/fa";
import { createEffect, createSignal } from "solid-js";
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
const maxDate = new Date(2022, 6, 22);
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
	const [selectedDate, setSelectedDate] = createSignal<Date | null>(null);
	// const [selectedDate, setSelectedDate] = createSignal(initialDate);
	const [selectedDate2, setSelectedDate2] = createSignal(new Date());
	const [selectedDate3, setSelectedDate3] = createSignal(new Date());

	let datepickerRef;
	// let datepickerRef2;
	// datepickerRef.open()
	// datepickerRef.close()

	createEffect(() => console.log("App", { selectedDate: selectedDate() }));

	return (
		<div class={s.App}>
			{/* <DatePicker_v1 /> */}
			<h1>DatePicker</h1>

			<div>
				<DatePicker_v2
					ref={datepickerRef}
					value={selectedDate()}
					type={"datePicker"}
					color={color}
					locale={"pt-BR"}
					icon={<FaCalendarAlt size={16} />}
					initialDate={new Date()}
					min={minDate}
					max={maxDate}
					placeholder={"29/04/1987"}
					hint={"brazilian"}
					// hint={"dd/mm/aaaa"}
					delimiter={"/"}
					applyMask={true}
					filter={weekendFilter}
					onDateSelected={d => setSelectedDate(d)} // both input and calendar
					// onInput={console.log} // input input
					onInput={e => {}} // input input
					// onInput={console.log} // input input
					onChange={e => {}} // input change
					closeAfterClick={false}
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

				{/* <DatePicker_v2
					closeAfterClick={true}
					ref={datepickerRef}
					value={selectedDate2()}
					type={"datePicker"}
					color={color}
					locale={"en"}
					icon={<FaCalendarAlt size={16} />}
					initialDate={initialDate}
					min={minDate}
					max={maxDate}
					placeholder={"04 29 1987"}
					hint={"american"}
					delimiter={" "}
					applyMask={true}
					filter={weekendFilter}
					onDateSelected={d => setSelectedDate2(d)} // both input and calendar
					// onInput={console.log} // input input
					onInput={e => {}} // input input
					// onInput={console.log} // input input
					onChange={e => {}} // input change
					label="DatePicker 2"
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
					closeAfterClick={false}
					ref={datepickerRef}
					value={selectedDate3()}
					type={"datePicker"}
					color={color}
					locale={"de"}
					icon={<FaCalendarAlt size={16} />}
					initialDate={initialDate}
					min={minDate}
					max={maxDate}
					placeholder={"1987-04-29"}
					hint={"german"}
					delimiter={"."}
					applyMask={true}
					filter={weekendFilter}
					onDateSelected={d => setSelectedDate3(d)} // both input and calendar
					// onInput={console.log} // input input
					onInput={e => {}} // input input
					// onInput={console.log} // input input
					onChange={e => {}} // input change
					label="DatePicker 2"
					disabled={false}
					inputDisabled={false}
					calendarDisabled={false}
					monthButtons={true}
					yearButtons={true}
					touchUIMode={false}
					calendarOnly={false} // no input, calendar only
					dateClass={higlight20thDay}
				/> */}

				{/* <DatePicker_v2
					ref={datepickerRef}
					value={selectedDate()}
					type={"datePicker"}
					color={color}
					locale={"jpn"}
					icon={<FaCalendarAlt size={16} />}
					initialDate={new Date()}
					min={minDate}
					max={maxDate}
					placeholder={"1987-04-29"}
					hint={"japanese"}
					// hint={"dd/mm/aaaa"}
					delimiter={"-"}
					applyMask={true}
					filter={weekendFilter}
					onDateSelected={d => setSelectedDate(d)} // both input and calendar
					// onInput={console.log} // input input
					onInput={e => {}} // input input
					// onInput={console.log} // input input
					onChange={e => {}} // input change
					closeAfterClick={false}
					label="DatePicker label"
					disabled={false}
					inputDisabled={false}
					calendarDisabled={false}
					monthButtons={true}
					yearButtons={true}
					touchUIMode={false}
					calendarOnly={false} // no input, calendar only
					dateClass={higlight20thDay}
				/> */}
			</div>
		</div>
	);
}
