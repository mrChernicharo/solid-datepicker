import { DateCell, DateSchema, Delimiter, IInputEvent } from './types';

const ID_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';

export const idMaker = () =>
  Array(12)
    .fill(0)
    .map((item) => ID_CHARS.split('')[Math.round(Math.random() * ID_CHARS.length)])
    .join('');

export const getWeekdays = (locale = 'en', weekday: 'long' | 'short' | 'narrow' = 'narrow') => {
  const format = new Intl.DateTimeFormat(locale, { weekday }).format;
  return [...Array(7).keys()].map((day) => format(new Date(Date.UTC(2021, 5, day))));
};

export const regex = (delimiter: Delimiter) => {
  const r = {
    letters: /[A-Za-z]+/g,
    specialChars: /[-. !?><:;\/"^'|\\{}()\[\]+=_*&%$#@~`]+/g,
    doubleDelim: new RegExp(`[${delimiter}][${delimiter}]`),
    beginningDelim: new RegExp(`^[${delimiter}]`),
    threeDelims: new RegExp(`(.)*[${delimiter}](.)*[${delimiter}](.)*[${delimiter}]`),
    // doubleDelim: /\/\//g,
    // beginningDelim: new RegExp(`^[${delimiter}]`),
    // beginningDelim: /^\//g,
    // threeDelims: /(.)+\/(.)+\/(.)+\//g,
  };

  return r;
};

const isLeapYear = (year) => {
  const marchFirst = new Date(new Date(year, 2, 1, 0, 0, 0).setFullYear(year));
  const lastDayOfFeb = new Date(marchFirst.getTime() - 10 * 60 * 1000).getDate();
  return lastDayOfFeb === 29;
};

export const hasMoreThanTwoDelims = (v: string, delimiter: string) =>
  v.split('').filter((ch) => ch === delimiter).length > 2;

export const hasLessThanTwoDelimiters = (v, delimiter) =>
  v.split('').filter((ch) => ch === delimiter).length < 2;

export const hasNoDelimiters = (v, delimiter) =>
  v.split('').filter((ch) => ch === delimiter).length === 0;

export const hasOnlyOneDelimiter = (v, delimiter) => v.split(delimiter).length === 2;

export const hasThreeDigitMonth = (v, delimiter) =>
  hasOnlyOneDelimiter(v, delimiter) && v.split(delimiter).find((val) => val.length > 2);

export const hasLongerThanFourDigits = (v, delimiter) =>
  v.split(delimiter).find((seq) => seq.length > 4);

export function maskInput(e: IInputEvent, format: DateSchema, delimiter: Delimiter) {
  let v = e.currentTarget.value;

  if (/delete/i.test(e.inputType)) {
    return;
  }

  let [selectionStart, selectionEnd] = [
    e.currentTarget.selectionStart || 0,
    e.currentTarget.selectionEnd || 0,
  ];

  const lastChar = v[v.length - 1];
  const regEx = regex(delimiter);

  v = v.replace(regEx.letters, '');
  v = v.replace(regEx.specialChars, delimiter);

  if (v.length > 10) {
    v = v.slice(0, selectionStart - 1) + v.slice(selectionEnd, v.length);
  }

  if (format === 'DMY' || format === 'MDY') {
    if (lastChar && lastChar.match(/\d/)) {
      if (v.length === 3) {
        v = [v.substring(0, 2), delimiter, v[2]].join('');
      }
      if (v.length === 5 && hasThreeDigitMonth(v, delimiter)) {
        v = [v.substring(0, 4), delimiter, v[4]].join('');
      }
      if (v.length === 6 && hasLessThanTwoDelimiters(v, delimiter)) {
        v = [v.substring(0, 5), delimiter, v[5]].join('');
      }
    }
  } else if (format === 'YMD') {
    if (lastChar && lastChar.match(/\d/)) {
      if (v.length === 5 && hasNoDelimiters(v, delimiter)) {
        v = [v.substring(0, 4), delimiter, v[4]].join('');
      }
      if (v.length === 8 && hasOnlyOneDelimiter(v, delimiter)) {
        v = [v.substring(0, 7), delimiter, v[7]].join('');
      }
    }
  }

  if (hasLongerThanFourDigits(v, delimiter)) {
    v = v
      .split(delimiter)
      .map((seq) => (seq.length < 4 ? seq : seq.slice(0, 4)))
      .join(delimiter);
  }

  if (v.match(regEx.threeDelims)) {
    let i = v.length;
    while (i > -1) {
      if (v[i] === delimiter) {
        v = v.slice(0, i);
        break;
      }
      i--;
    }
  }

  v = v.replace(regEx.beginningDelim, '');
  v = v.replace(regEx.doubleDelim, delimiter);

  e.currentTarget.value = v;
}

export function checkIsDisabled(
  d: DateCell,
  filterFn: ((d: Date) => boolean) | undefined = undefined,
  min: Date | null = null,
  max: Date | null = null,
) {
  let disabled = !!filterFn && !filterFn(d.date);

  if (min !== null && d.date < min) {
    disabled = true;
  }
  if (max !== null && d.date > max) {
    disabled = true;
  }

  return disabled;
}

export function getDaysGrid(date: Date, locale = 'en', delimiter = '/') {
  // console.time('getDaysGrid');
  const dateMonth = date.getMonth();
  const dateYear = date.getFullYear();

  const prevMonth = dateMonth === 0 ? 11 : dateMonth - 1;
  const nextMonth = dateMonth === 11 ? 0 : dateMonth + 1;

  const lastDayInMonth = new Date(
    new Date(dateMonth === 11 ? dateYear + 1 : dateYear, nextMonth, 1).getTime() - 1000 * 60,
  ).getDate();

  const lastDayInPrevMonth = new Date(
    new Date(dateMonth === 11 ? dateYear + 1 : dateYear, dateMonth, 1).getTime() - 1000 * 60,
  ).getDate();

  const days: any[] = [];

  for (let i = 1; i <= lastDayInMonth; i++) {
    const d = new Date(dateYear, dateMonth, i);
    days.push({
      date: d,
      dateStr: d.toLocaleDateString(locale).replaceAll(/[-/.@#$%^&*|;:\s]/g, delimiter),
      weekday: d.getDay(),
      day: i,
    });
  }

  let firstRowOffset = days[0].weekday;
  let lastRowOffset = 6 - days.at(-1).weekday;

  const initialDaysFromNextMonth: any[] = [];
  let initialDay = 1;

  while (lastRowOffset > 0) {
    const nextDate = new Date(dateMonth === 11 ? dateYear + 1 : dateYear, nextMonth, initialDay);

    initialDaysFromNextMonth.push({
      date: nextDate,
      dateStr: nextDate.toLocaleDateString(locale).replaceAll(/[-/.@#$%^&*|;:\s]/g, delimiter),
      weekday: nextDate.getDay(),
      day: initialDay,
    });

    initialDay++;
    lastRowOffset--;
  }

  const lastDaysFromPrevMonth: any[] = [];
  let lastDay = lastDayInPrevMonth;

  while (firstRowOffset > 0) {
    const prevDate = new Date(dateMonth === 0 ? dateYear - 1 : dateYear, prevMonth, lastDay);

    lastDaysFromPrevMonth.unshift({
      date: prevDate,
      dateStr: prevDate.toLocaleDateString(locale).replaceAll(/[-/.@#$%^&*|;:\s]/g, delimiter),
      weekday: prevDate.getDay(),
      day: lastDay,
    });

    --lastDay;
    --firstRowOffset;
  }

  // get last days from previous month
  const res: DateCell[] = [...lastDaysFromPrevMonth, ...days, ...initialDaysFromNextMonth].map(
    (o, i) => ({ ...o, gridPos: i }),
  );

  // console.log({ grid: res });
  // console.timeEnd('getDaysGrid');

  return res;
}

export const isSameDate = (d: Date, selectedDate: Date) =>
  new Date(d.setHours(0, 0, 0)).getTime() === new Date(selectedDate.setHours(0, 0, 0)).getTime();

export const isCurrentMonth = (d: Date, selectedDate: Date) =>
  d.getMonth() === selectedDate.getMonth();

export const parseDateString = (
  str: string,
  dateSchema: DateSchema,
  delimiter: string | undefined,
) => {
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

export function getDefaultPlaceholder(locale: string, delimiter: Delimiter) {
  return [...getDateFormat(new Date(), locale, delimiter)]
    .map((ch) => {
      if (regex(' ').specialChars.test(ch)) return ch;
      else if (ch === 'D') return Array(2).fill('d').join('');
      else if (ch === 'M') return Array(2).fill('m').join('');
      else if (ch === 'Y') return Array(4).fill('y').join('');
    })
    .join('');
}

export function getDateFormat(d: Date, locale: string | undefined, delimiter: string | undefined) {
  let localeDate,
    formattedDate,
    splitDate,
    dayA,
    monthA,
    month,
    dateB,
    testDate,
    splitTestDate,
    formattedTestDate,
    notMonth,
    year,
    day,
    dayIndex,
    monthIndex,
    yearIndex,
    dayMonth;

  if (!d) return '';

  locale = locale ? locale : 'en'; // falsy or invalid defaults to en

  localeDate = d.toLocaleDateString(locale);

  if (!delimiter) delimiter = localeDate.replace(/\d/g, '')[0];
  if (!delimiter) delimiter = '/';

  formattedDate = localeDate.replace(/\D/g, delimiter);

  splitDate = formattedDate.split(delimiter).map(Number);

  dayA = d.getDate();
  monthA = d.getMonth() + 1;
  month = splitDate.find((_d) => _d === monthA);
  day = splitDate.find((_d) => _d === dayA);
  year = d.getFullYear();

  dayIndex = splitDate.findIndex((v) => v === day);
  monthIndex = splitDate.findIndex((v) => v === month);
  yearIndex = splitDate.findIndex((v) => v === year);

  if (day === month) {
    // compare to another date and find out who's month and who's day
    dateB = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate());
    testDate = dateB.toLocaleDateString(locale); // date + 1 month
    formattedTestDate = testDate.replace(/\D/g, delimiter);
    splitTestDate = formattedTestDate.split(delimiter);

    dayMonth = splitTestDate.filter((d) => d.length !== 4).map(Number);
    notMonth = dayMonth.find((d) => d !== month);

    month = dayMonth.find((d) => d !== notMonth);

    monthIndex =
      yearIndex === 0
        ? dayMonth.findIndex((v) => v === notMonth) + 1
        : dayMonth.findIndex((v) => v === notMonth);
    dayIndex =
      yearIndex === 0
        ? dayMonth.findIndex((v) => v !== notMonth) + 1
        : dayMonth.findIndex((v) => v !== notMonth);
  }

  const dateSchema: string[] = [];
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
  console.log(result);
  // console.log({result, dateSchema, year, yearIndex, splitDate})
  return result as DateSchema;
}

export function isValidDate(str: string, format: DateSchema, delimiter: Delimiter) {
  const sliced = str.split(delimiter).map(Number);
  let d = 0,
    m = 0,
    y = 0,
    res: Date | number | null;

  if (format === 'DMY') {
    [d, m, y] = sliced;
  }
  if (format === 'MDY') {
    [m, d, y] = sliced;
  }
  if (format === 'YMD') {
    [y, m, d] = sliced;
  }

  if (
    !d ||
    !m ||
    !y ||
    m > 12 ||
    ([1, 3, 5, 7, 8, 10, 12].includes(m) && d > 31) ||
    ([4, 6, 9, 7, 11].includes(m) && d > 30) ||
    (m === 2 && (isLeapYear(y) ? d > 29 : d > 28))
  ) {
    return false;
  } else {
    const date = new Date(y, m - 1, d, 12, 0, 0).setFullYear(y);
    return isNaN(new Date(date).getTime()) ? false : true;
  }
}
