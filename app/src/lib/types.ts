import { JSXElement } from 'solid-js';

export type DateSchema = 'DMY' | 'MDY' | 'YMD';
export type Theme = 'light' | 'dark';

export type DateCell = {
  date: Date;
  dateStr: string;
  day: number;
  weekday: number;
  gridPos: number;
};

export type LogicCell = {
  col: number;
  day: number;
  disabled: boolean;
  pos: number;
  row: number;
  weekday: number;
};

export type DatePickerType =
  | 'monthYearPicker'
  | 'datePicker'
  | 'timePicker'
  | 'datetimePicker'
  | 'dateRange'
  | 'timeRange';

export type DatepickerColor =
  | 'bg'
  | 'bgDark'
  | 'bgMedium'
  | 'text'
  | 'textMedium'
  | 'textSecondary'
  | 'textDark';

export interface DatepickerProps {
  value: Date | null;
  color?: string;
  icon?: JSXElement;
  hint?: string;
  initialDate?: Date;
  min?: Date | null;
  max?: Date | null;
  delimiter?: Delimiter;
  inputWidth?: number;
  theme?: Theme;
  filter?: (d: Date) => boolean;
  onDateSelected: (d: Date | null) => void; // both input and calenda;
  onInput?: (e: any) => void; // input input;
  onChange?: (e: any) => void; // input chang;
  dateClass?: (d: Date) => string;
  label?: string;
  errorMessage?: string;
  placeholder?: string;
  applyMask?: boolean;
  disabled?: boolean;
  inputDisabled?: boolean;
  calendarImperativelyOpened?: boolean;
  calendarDisabled?: boolean;
  closeAfterClick?: boolean;
  hideYearButtons?: boolean;
  locale?: string;
  type?: DatePickerType;
  touchUIMode?: boolean;
  calendarOnly?: boolean; // no input, calendar onl;
}

export type IInputEvent = InputEvent & {
  currentTarget: HTMLInputElement;
  target: Element;
};

// export type DateFormat = 'DMY' | 'MDY' | 'YMD';

export type Delimiter =
  | '/'
  | '-'
  | '.'
  | ' '
  | ','
  | ':'
  | ';'
  | '_'
  | "'"
  | '"'
  | '*'
  | '|'
  | '+'
  | '='
  | '&'
  | '$'
  | '#'
  | '@'
  | '!'
  | '?'
  | '>'
  | '<';
