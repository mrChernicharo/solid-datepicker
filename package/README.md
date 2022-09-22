# Solid DatePicker

### A reusable datepicker for solidJS projects

## Sample usage

```
import { DatePicker } from '@melodev/solid-datepicker';

export default function App() {
    const [selectedDate, setSelectedDate] = createSignal<Date | null>(null);

    return (
        <div>
        	<DatePicker
                value={selectedDate()}
                onDateSelected={d => setSelectedDate(d)}
            />
        </div>
    );
}
```

## Customize your datepicker

set locale, color, icon, input mask, min and max dates, toggle calendar features, use your own logic to disable dates and add custom classes.

```
 <DatePicker
    inputWidth={140}
    ref={datepickerRef}
    color={color}
    locale={'pt-BR'}
    icon={<FaCalendarAlt size={16} />}
    initialDate={new Date()}
    min={minDate}
    max={maxDate}
    placeholder={'29/04/1987'}
    hint={'brazilian'}
    hint={"dd/mm/aaaa"}
    delimiter={'/'}
    applyMask={true}
    filter={weekendFilter}
    value={selectedDate()}
    onDateSelected={d => setSelectedDate(d)} // both input and calendar
    onInput={console.log} // input input
    onChange={console.log} // input change
    closeAfterClick={false}
    label="DatePicker"
    disabled
    hideYearButtons={false}
    calendarOnly={false} // no input, calendar only
    dateClass={higlight20thDay}
/>
```

# DEFAULT_PROPS

```
const DEFAULT_PROPS: DatepickerProps = {
	ref: null,
	value: null,
	color: '#009898',
	icon: DEFAULT_ICON,
	hint: '',
	initialDate: new Date(),
	min: null,
	max: null,
	delimiter: '/',
	inputWidth: 160,
	errorMessage: 'invalid date',
	filter: (d: Date) => true,
	onDateSelected: (d: Date | null) => d,
	onInput: (e: any) => e,
	onChange: (e: any) => e,
	dateClass: (d: Date) => '',
	label: 'date picker',
	placeholder: 'placeholder',
	theme: 'light',
	applyMask: true,
	disabled: false,
	inputDisabled: false,
	calendarDisabled: false,
	closeAfterClick: false,
	hideYearButtons: false,
	locale: 'en',
	type: 'datePicker',
	calendarOnly: false, // no input, calendar only;
};
```
