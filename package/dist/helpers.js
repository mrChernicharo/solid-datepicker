const ID_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
export const idMaker = () => Array(12)
    .fill(0)
    .map(item => ID_CHARS.split('')[Math.round(Math.random() * ID_CHARS.length)])
    .join('');
export const getWeekdays = (locale = 'en', weekday = 'narrow') => {
    const format = new Intl.DateTimeFormat(locale, { weekday }).format;
    return [...Array(7).keys()].map(day => format(new Date(Date.UTC(2021, 5, day))));
};
export const placeholderText = {
    en: 'mm/dd/yyyy',
    'pt-BR': 'dd/mm/aaaa',
};
export function maskInput(val, dateSchema, delimiter) {
    if (!delimiter)
        delimiter = '/';
    let v, digitsAndDelimiterRegex, dayMonthRegex, yearRegex;
    digitsAndDelimiterRegex = new RegExp(`[^${delimiter}0-9]`);
    v = val.replace(digitsAndDelimiterRegex, '');
    if (dateSchema === 'YMD') {
        yearRegex = /(\d{4})(\d)/;
        dayMonthRegex = new RegExp(`(\\d{4}${delimiter}\\d{2})(\\d)`, 'g');
        v = v.replace(yearRegex, `$1${delimiter}$2`);
        v = v.replace(dayMonthRegex, `$1${delimiter}$2`);
    }
    else {
        dayMonthRegex = new RegExp(/(\d{2})(\d)/);
        yearRegex = new RegExp(`(\\d+${delimiter}\\d+${delimiter})(\\d)`);
        // prettier-ignore
        v = v.length < 7 ? v.replace(dayMonthRegex, `$1${delimiter}$2`) : v;
        v = v.replace(yearRegex, '$1$2');
    }
    v = v.length > 10 ? v.slice(0, 10) : v;
    return v;
}
export function parseDate(dateStr) {
    if (dateStr.length !== 10)
        return null;
    let [day, month, year] = dateStr.split('/').map(Number);
    if (month > 12) {
        month = 12;
    }
    if (day > 31) {
        day = 31;
    }
    const date = new Date(year, month - 1, day);
    return date;
}
export function getDaysGrid(date, locale = 'en', delimiter = '/') {
    console.time('getDaysGrid');
    const dateMonth = date.getMonth();
    const dateYear = date.getFullYear();
    const prevMonth = dateMonth === 0 ? 11 : dateMonth - 1;
    const nextMonth = dateMonth === 11 ? 0 : dateMonth + 1;
    const lastDayInMonth = new Date(new Date(dateMonth === 11 ? dateYear + 1 : dateYear, nextMonth, 1).getTime() -
        1000 * 60).getDate();
    const lastDayInPrevMonth = new Date(new Date(dateMonth === 11 ? dateYear + 1 : dateYear, dateMonth, 1).getTime() -
        1000 * 60).getDate();
    const days = [];
    for (let i = 1; i <= lastDayInMonth; i++) {
        const d = new Date(dateYear, dateMonth, i);
        days.push({
            date: d,
            dateStr: d
                .toLocaleDateString(locale)
                .replace(/[-/.@#$%^&*|;:\s]/g, delimiter),
            weekday: d.getDay(),
            day: i,
        });
    }
    let firstRowOffset = days[0].weekday;
    let lastRowOffset = 6 - days.at(-1).weekday;
    const initialDaysFromNextMonth = [];
    let initialDay = 1;
    while (lastRowOffset > 0) {
        const nextDate = new Date(dateMonth === 11 ? dateYear + 1 : dateYear, nextMonth, initialDay);
        initialDaysFromNextMonth.push({
            date: nextDate,
            dateStr: nextDate
                .toLocaleDateString(locale)
                .replace(/[-/.@#$%^&*|;:\s]/g, delimiter),
            weekday: nextDate.getDay(),
            day: initialDay,
        });
        initialDay++;
        lastRowOffset--;
    }
    const lastDaysFromPrevMonth = [];
    let lastDay = lastDayInPrevMonth;
    while (firstRowOffset > 0) {
        const prevDate = new Date(dateMonth === 0 ? dateYear - 1 : dateYear, prevMonth, lastDay);
        lastDaysFromPrevMonth.unshift({
            date: prevDate,
            dateStr: prevDate
                .toLocaleDateString(locale)
                .replace(/[-/.@#$%^&*|;:\s]/g, delimiter),
            weekday: prevDate.getDay(),
            day: lastDay,
        });
        --lastDay;
        --firstRowOffset;
    }
    // get last days from previous month
    const res = [
        ...lastDaysFromPrevMonth,
        ...days,
        ...initialDaysFromNextMonth,
    ];
    console.timeEnd('getDaysGrid');
    return res;
}
export const isSameDate = (d, selectedDate) => new Date(d.setHours(0, 0, 0)).getTime() ===
    new Date(selectedDate.setHours(0, 0, 0)).getTime();
export const isCurrentMonth = (d, selectedDate) => d.getMonth() === selectedDate.getMonth();
export const parseDateString = (str, dateSchema, delimiter) => {
    const schema = {
        Y: 'year',
        M: 'month',
        D: 'day',
    };
    const values = {
        day: '',
        month: '',
        year: '',
    };
    let splitValues = str.split(delimiter || '/');
    for (let i = 0; i < 3; i++) {
        values[schema[dateSchema[i]]] = splitValues[i];
    }
    const { year, month, day } = values;
    return { year: +year, month: +month - 1, day: +day };
};
export function getDateFormat(d, locale, delimiter) {
    let localeDate, formattedDate, splitDate, dayA, monthA, month, dateB, testDate, splitTestDate, formattedTestDate, notMonth, year, day, dayIndex, monthIndex, yearIndex, dayMonth;
    if (!d)
        return '';
    locale = locale ? locale : 'en'; // falsy or invalid defaults to en
    localeDate = d.toLocaleDateString(locale);
    if (!delimiter)
        delimiter = localeDate.replace(/\d/g, '')[0];
    if (!delimiter)
        delimiter = '/';
    formattedDate = localeDate.replace(/\D/g, delimiter);
    splitDate = formattedDate.split(delimiter).map(Number);
    dayA = d.getDate();
    monthA = d.getMonth() + 1;
    month = splitDate.find(_d => _d === monthA);
    day = splitDate.find(_d => _d === dayA);
    year = d.getFullYear();
    dayIndex = splitDate.findIndex(v => v === day);
    monthIndex = splitDate.findIndex(v => v === month);
    yearIndex = splitDate.findIndex(v => v === year);
    if (day === month) {
        // compare to another date and find out who's month and who's day
        dateB = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate());
        testDate = dateB.toLocaleDateString(locale); // date + 1 month
        formattedTestDate = testDate.replace(/\D/g, delimiter);
        splitTestDate = formattedTestDate.split(delimiter);
        dayMonth = splitTestDate.filter(d => d.length !== 4).map(Number);
        notMonth = dayMonth.find(d => d !== month);
        month = dayMonth.find(d => d !== notMonth);
        monthIndex =
            yearIndex === 0
                ? dayMonth.findIndex(v => v === notMonth) + 1
                : dayMonth.findIndex(v => v === notMonth);
        dayIndex =
            yearIndex === 0
                ? dayMonth.findIndex(v => v !== notMonth) + 1
                : dayMonth.findIndex(v => v !== notMonth);
    }
    const dateSchema = [];
    const schema = {
        [dayIndex]: 'D',
        [monthIndex]: 'M',
        [yearIndex]: 'Y',
    };
    for (let i = 0; i < 3; i++) {
        dateSchema.push(schema[i]);
        if (i < 2) {
            dateSchema.push(delimiter);
        }
    }
    const result = dateSchema.join('');
    // console.log({result, dateSchema, year, yearIndex, splitDate})
    return result;
}
//# sourceMappingURL=helpers.js.map