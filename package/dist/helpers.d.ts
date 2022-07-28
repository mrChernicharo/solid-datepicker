import { JSXElement } from 'solid-js';
export declare type DateSchema = 'DMY' | 'MDY' | 'YMD';
export declare type Theme = 'light' | 'dark';
export declare type DateCell = {
    date: Date;
    dateStr: string;
    day: number;
    weekday: number;
};
export declare type DatePickerType = 'monthYearPicker' | 'datePicker' | 'timePicker' | 'datetimePicker' | 'dateRange' | 'timeRange';
export declare type DatepickerColor = 'bg' | 'bgDark' | 'bgMedium' | 'text' | 'textMedium' | 'textSecondary' | 'textDark';
export interface DatepickerProps {
    value: Date | null;
    ref?: any;
    color?: string;
    icon?: JSXElement;
    hint?: string;
    initialDate?: Date;
    min?: Date | null;
    max?: Date | null;
    delimiter?: string;
    inputWidth?: number;
    theme?: Theme;
    filter?: (d: Date) => boolean;
    onDateSelected: (d: Date | null) => void;
    onInput?: (e: any) => void;
    onChange?: (e: any) => void;
    dateClass?: (d: Date) => string;
    label?: string;
    errorMessage?: string;
    placeholder?: string;
    applyMask?: boolean;
    disabled?: boolean;
    inputDisabled?: boolean;
    calendarDisabled?: boolean;
    closeAfterClick?: boolean;
    showYearButtons?: boolean;
    locale?: string;
    type?: DatePickerType;
    touchUIMode?: boolean;
    calendarOnly?: boolean;
}
export declare const idMaker: () => string;
export declare const getWeekdays: (locale?: string, weekday?: 'long' | 'short' | 'narrow') => string[];
export declare const placeholderText: {
    [key: string]: string;
};
export declare function maskInput(val: string, dateSchema: 'DMY' | 'MDY' | 'YMD', delimiter: string | undefined): any;
export declare function parseDate(dateStr: string): Date | null;
export declare function getDaysGrid(date: Date, locale?: string, delimiter?: string): DateCell[];
export declare const isSameDate: (d: Date, selectedDate: Date) => boolean;
export declare const isCurrentMonth: (d: Date, selectedDate: Date) => boolean;
export declare const parseDateString: (str: string, dateSchema: DateSchema, delimiter: string | undefined) => {
    year: number;
    month: number;
    day: number;
};
export declare function getDateFormat(d: Date, locale: string | undefined, delimiter: string | undefined): string;
