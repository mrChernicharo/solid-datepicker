import { Component, createEffect, createMemo, createSignal, For, Show } from "solid-js";
import {
	FaCalendar,
	FaCalendarTimes,
	FaCalendarAlt,
	FaSolidChevronLeft,
	FaSolidChevronRight,
	FaSolidCaretRight,
	FaSolidCaretLeft,
	FaSolidFastForward,
	FaSolidPlay,
	FaSolidAngleDoubleLeft,
	FaSolidAngleDoubleRight,
	FaSolidAngleLeft,
	FaSolidAngleRight,
} from "solid-icons/fa";

import s from "./App.module.css";
import {
	getDaysGrid,
	inputMask,
	months,
	parseDate,
	placeholderText,
	weekdays,
} from "./utils/helpers";

// let lang = "en";
let lang = "pt-BR";

const App: Component = () => {
	let inputRef;
	const [dateStr, setDateStr] = createSignal("");
	const [selectedDate, setSelectedDate] = createSignal(
		new Date(new Date().setHours(0, 0, 0))
	);
	const [showCalendar, setShowCalendar] = createSignal(true);

	function handleInputChange(e) {
		const maskedValue = inputMask("date", e.currentTarget.value);
		inputRef.value = maskedValue;
		setDateStr(inputRef.value);

		const isValidDate =
			parseDate(dateStr()) && parseDate(dateStr()) !== selectedDate();

		if (isValidDate) {
			console.log("valid");
			setSelectedDate(parseDate(dateStr())!);
		}
	}

	function handleKeyDown(e) {
		const { selectionStart, selectionEnd } = inputRef;

		switch (e.code) {
			case "ArrowDown": {
				setShowCalendar(true);
				return console.log(e);
			}
			case "ArrowUp": {
				setShowCalendar(false);
				return console.log(e);
			}
			case "ArrowLeft": {
				return console.log(e, { selectionStart, selectionEnd });
			}
			case "ArrowRight": {
				return console.log(e);
			}
			case "Backspace": {
				return console.log(e, { selectionStart, selectionEnd });
			}
		}
	}

	function incrementMonth() {
		const currentDay = selectedDate().getDate();
		const currentMonth = selectedDate().getMonth();
		const currentYear = selectedDate().getFullYear();

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

		setSelectedDate(nextDate);
	}
	function decrementMonth() {
		const currentDay = selectedDate().getDate();
		const currentMonth = selectedDate().getMonth();
		const currentYear = selectedDate().getFullYear();

		const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;

		const prevDate = new Date(
			prevMonth === 11 ? currentYear - 1 : currentYear,
			prevMonth,
			currentDay
		);

		setSelectedDate(prevDate);
	}
	function incrementYear() {
		const timestamp = selectedDate().getTime() + 1000 * 60 * 60 * 24 * 365.25;
		setSelectedDate(new Date(timestamp));
	}
	function decrementYear() {
		const timestamp = selectedDate().getTime() - 1000 * 60 * 60 * 24 * 365.25;
		setSelectedDate(new Date(timestamp));
	}

	const isSameDate = (d: Date) =>
		new Date(d.setHours(0, 0, 0)).getTime() ===
		new Date(selectedDate().setHours(0, 0, 0)).getTime();

	const isCurrentMonth = (d: Date) => d.getMonth() === selectedDate().getMonth();

	const dayGrid = createMemo(() => getDaysGrid(selectedDate()));

	createEffect(() => {
		// console.log(getDaysGrid(selectedDate()));
		console.log(selectedDate());
		inputRef.value = selectedDate().toLocaleDateString(lang);
	});

	return (
		<div class={s.App}>
			<h1>Solid Datepicker</h1>

			<div class={s.datePicker}>
				<div class={s.inputContainer}>
					<input
						class={s.input}
						type="text"
						ref={inputRef}
						placeholder={placeholderText[lang]}
						onInput={handleInputChange}
						onKeyDown={handleKeyDown}
					/>

					<button
						class={s.inputBtn}
						onClick={e => setShowCalendar(!showCalendar())}>
						<FaCalendarAlt size={24} color="#333" />
					</button>
				</div>

				<Show when={showCalendar()}>
					<div class={s.monthSelectContainer}>
						<div class={s.monthSelectChevron} onClick={decrementYear}>
							<button class={s.hiddenBtn}>
								{/* <FaSolidPlay size={12} style={{ transform: "rotate(180deg)" }}/> */}
								{/* <FaSolidCaretLeft /> */}
								{/* <FaSolidChevronLeft /> */}
								<FaSolidAngleDoubleLeft size={16} />
							</button>
						</div>

						<div class={s.monthSelectChevron} onClick={decrementMonth}>
							<button class={s.hiddenBtn}>
								<FaSolidAngleLeft size={16} />
							</button>
						</div>

						<div class={s.selectedYearMonth}>
							{months[selectedDate().getMonth()]}{" "}
							{selectedDate().getFullYear()}
						</div>

						<div class={s.monthSelectChevron} onClick={incrementMonth}>
							<button class={s.hiddenBtn}>
								<FaSolidAngleRight size={16} />
							</button>
						</div>
						<div class={s.monthSelectChevron} onClick={incrementYear}>
							<button class={s.hiddenBtn}>
								<FaSolidAngleDoubleRight size={16} />
							</button>
						</div>
					</div>

					<div class={s.calendarContainer}>
						<For each={weekdays}>
							{weekday => <div class={s.dateCell}>{weekday}</div>}
						</For>
						<For each={dayGrid()}>
							{d => {
								// console.log({ date: d.date, selec: selectedDate() });

								return (
									<div
										class={`${s.dateCell} 
                    ${isSameDate(d.date) ? s.selectedDate : ""} 
                    ${!isCurrentMonth(d.date) ? s.notCurrentMonthCell : ""} 
                  `}
										onClick={e => {
											setSelectedDate(d.date);
											// setShowCalendar(false);
										}}>
										<button class={s.hiddenBtn}>{d.day}</button>
									</div>
								);
							}}
						</For>
					</div>
				</Show>
			</div>

			<input type="date" />
		</div>
	);
};

export default App;
