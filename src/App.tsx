// import { Component, createEffect, createMemo, createSignal, For, Show } from "solid-js";
import s from "./App.module.css";
import CalendarV1 from "./components/CalendarV1";

export default function App() {
	return (
		<div class={s.App}>
			<CalendarV1 />
		</div>
	);
}
