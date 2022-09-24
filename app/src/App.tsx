import { FaCalendarAlt, FaHeart, FaSolidChevronDown, FaSolidLayerGroup } from 'solid-icons/fa';
import { createEffect, createSignal } from 'solid-js';
import { DatePicker } from './components/DatePicker';
// import { DatePicker } from '../../package/src/index';
// @ts-ignore
// import { DatePicker } from '@melodev/solid-datepicker';

// let lang = "en";
let lang = 'pt-BR';

const color = '#0098ae';
const minDate = new Date(2022, 5, 11);
const maxDate = new Date(2022, 6, 22);
const initialDate = new Date(2022, 6, 13);

// Prevent Saturday and Sunday from being selected.
const weekendFilter = (d: Date | null): boolean => {
  const day = (d || new Date()).getDay();
  return day !== 0 && day !== 6;
};

const evenDayFilter = (d: Date | null): boolean => {
  const day = (d || new Date()).getDate();
  return day % 2 === 0;
};

const higlight20thDay = (d: Date | null) => {
  const day = (d || new Date()).getDate();
  return day === 20 ? 'highlighted-20' : '';
};

export default function App() {
  const [selectedDate, setSelectedDate] = createSignal<Date | null>(null);
  const [selectedDate2, setSelectedDate2] = createSignal<Date | null>(null);
  const [selectedDate3, setSelectedDate3] = createSignal<Date | null>(null);
  const [selectedDate4, setSelectedDate4] = createSignal<Date | null>(null);
  const [selectedDate5, setSelectedDate5] = createSignal<Date | null>(null);
  const [selectedDate6, setSelectedDate6] = createSignal<Date | null>(null);

  // datepickerRef.open()
  // datepickerRef.close()

  createEffect(() => console.log('App', { selectedDate: selectedDate() }));

  return (
    <div class="App">
      <h1>DatePicker</h1>

      {/* 
          <button onclick={(e) => console.log('not working')}>
            open datepicker 1
          </button> 
      */}

      <div>
        <DatePicker
          // inputWidth={140}
          type={'datePicker'}
          color={color}
          locale={'pt-BR'}
          icon={<FaCalendarAlt size={16} />}
          initialDate={new Date()}
          // min={minDate}
          // max={maxDate}
          placeholder={'29/04/1987'}
          hint={'brazilian'}
          // hint={"dd/mm/aaaa"}
          delimiter={'/'}
          applyMask={true}
          filter={weekendFilter}
          value={selectedDate()}
          onDateSelected={(d) => setSelectedDate(d)} // both input and calendar
          // onInput={console.log} // input input
          onInput={(e) => {}} // input input
          // onInput={console.log} // input input
          onChange={(e) => {}} // input change
          closeAfterClick={false}
          label="Data de nascimento"
          // inputDisabled
          //  calendarDisabled
          // disabled
          hideYearButtons={false}
          touchUIMode={false}
          calendarOnly={false} // no input, calendar only
          dateClass={higlight20thDay}
        />
        <small>{selectedDate()?.toLocaleDateString('pt-BR')}</small>

        <DatePicker
          inputWidth={380}
          closeAfterClick={true}
          type={'datePicker'}
          color={'orange'}
          locale={'en'}
          theme="dark"
          // disabled
          // inputDisabled
          // calendarDisabled
          icon={<FaHeart size={16} />}
          initialDate={initialDate}
          min={minDate}
          max={maxDate}
          placeholder={'04 29 1987'}
          hint={'american'}
          delimiter={'*'}
          applyMask={true}
          filter={weekendFilter}
          value={selectedDate2()}
          onDateSelected={(d) => setSelectedDate2(d)} // both input and calendar
          // onInput={console.log} // input input
          onInput={(e) => {}} // input input
          // onInput={console.log} // input input
          onChange={(e) => {}} // input change
          label="Hey"
          hideYearButtons
          // inputDisabled
          // calendarDisabled
          // disabled
          touchUIMode={false}
          calendarOnly={false} // no input, calendar only
          dateClass={higlight20thDay}
        />
        <small>{selectedDate2()?.toLocaleDateString('en').replace(/\*/g, '*')}</small>

        <DatePicker
          inputWidth={300}
          type={'datePicker'}
          color={'red'}
          locale={'de'}
          icon={<FaSolidChevronDown size={16} />}
          initialDate={initialDate}
          min={new Date(2022, 3, 29)}
          max={new Date(2022, 11, 4)}
          placeholder={'29-04-1987'}
          hint={'german'}
          delimiter={'.'}
          applyMask={true}
          filter={evenDayFilter}
          value={selectedDate3()}
          onDateSelected={(d) => setSelectedDate3(d)} // both input and calendar
          // onInput={console.log} // input input
          onInput={(e) => {}} // input input
          // onInput={console.log} // input input
          onChange={(e) => {}} // input change
          label="DatePicker 2 DatePicker 2 DatePicker 2"
          // inputDisabled
          // calendarDisabled
          // disabled
          hideYearButtons={true}
          touchUIMode={false}
          calendarOnly={false} // no input, calendar only
          dateClass={higlight20thDay}
        />
        <small>{selectedDate3()?.toLocaleDateString('de').replace(/\./g, '.')}</small>

        <DatePicker
          value={selectedDate4()}
          locale="jpn"
          delimiter="-"
          placeholder="yyyy-mm-dd"
          onDateSelected={(d) => setSelectedDate4(d)}
          theme="dark"
        />
        <small>{selectedDate4()?.toLocaleDateString('jpn').replace(/-/g, '-')}</small>

        <DatePicker value={selectedDate5()} onDateSelected={(d) => setSelectedDate5(d)} />
        <small>{selectedDate5()?.toDateString()}</small>

        <DatePicker
          locale="fr"
          icon={<FaSolidLayerGroup />}
          value={selectedDate6()}
          onDateSelected={(d) => setSelectedDate6(d)}
        />
        <small>{selectedDate6()?.toDateString()}</small>
      </div>
    </div>
  );
}
