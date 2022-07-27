import { FaCalendarAlt, FaHeart, FaSolidChevronDown } from "solid-icons/fa";
import { createEffect, createSignal } from "solid-js";
import s from "./App.module.css";
import DatePicker from "./components/DatePicker";
// let lang = "en";
let lang = "pt-BR";

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
	const [selectedDate2, setSelectedDate2] = createSignal<Date | null>(null);
	const [selectedDate3, setSelectedDate3] = createSignal<Date | null>(null);

	let datepickerRef;
	// datepickerRef.open()
	// datepickerRef.close()

	createEffect(() => console.log("App", { selectedDate: selectedDate() }));

	return (
		<div class={s.App}>
			{/* <DatePicker_v1 /> */}
			<h1>DatePicker</h1>

			<div>
				<DatePicker
					inputWidth={200}
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
					showYearButtons={false}
					touchUIMode={false}
					calendarOnly={false} // no input, calendar only
					dateClass={higlight20thDay}
				/>

				<DatePicker
					inputWidth={400}
					closeAfterClick={true}
					ref={datepickerRef}
					value={selectedDate2()}
					type={"datePicker"}
					color={"orange"}
					locale={"en"}
					// disabled
					// inputDisabled
					calendarDisabled
					icon={<FaHeart size={16} />}
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
					showYearButtons={true}
					touchUIMode={false}
					calendarOnly={false} // no input, calendar only
					dateClass={higlight20thDay}
				/>
				<DatePicker
					inputWidth={300}
					closeAfterClick={false}
					ref={datepickerRef}
					value={selectedDate3()}
					type={"datePicker"}
					color={"red"}
					locale={"de"}
					icon={<FaSolidChevronDown size={16} />}
					initialDate={initialDate}
					min={minDate}
					max={maxDate}
					placeholder={"1987-04-29"}
					hint={"german"}
					delimiter={"."}
					applyMask={true}
					filter={d => true}
					onDateSelected={d => setSelectedDate3(d)} // both input and calendar
					// onInput={console.log} // input input
					onInput={e => {}} // input input
					// onInput={console.log} // input input
					onChange={e => {}} // input change
					label="DatePicker 2"
					disabled={false}
					inputDisabled={false}
					calendarDisabled={false}
					showYearButtons={true}
					touchUIMode={false}
					calendarOnly={false} // no input, calendar only
					dateClass={higlight20thDay}
				/>
			</div>
		</div>
	);
}
