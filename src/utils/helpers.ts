export const months = [
	"janeiro",
	"fevereiro",
	"março",
	"abril",
	"maio",
	"junho",
	"julho",
	"agosto",
	"setembro",
	"outubro",
	"novembro",
	"dezembro",
];

export const weekdays = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

export const placeholderText: { [key: string]: string } = {
	en: "mm/dd/yyyy",
	"pt-BR": "dd/mm/aaaa",
};

export function inputMask(maskType: string, val: string) {
	// prettier-ignore
	switch (maskType) {
		case "date": {
            let v: string;
            
            if (val.length > 10) {
                v = val.slice(0, -1)
                return v
            }

			v = val;
			v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito

			v = v.replace(/(\d{2})(\d)/, "$1/$2");      //Coloca barra entre o 2o e o 3o dígitos
			v = v.replace(/(\d{2})(\d)/, "$1/$2");      //de novo (para o segundo bloco de números)

			// v=v.replace(/\D/g,"")                    //Remove tudo o que não é dígito
			// v=v.replace(/(\d{3})(\d)/,"$1.$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
			// v=v.replace(/(\d{3})(\d)/,"$1.$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
			//                                          //de novo (para o segundo bloco de números)
			// v=v.replace(/(\d{3})(\d{1,2})$/,"$1-$2") //Coloca um hífen entre o terceiro e o quarto dígitos
			return v || "";
		}
		default:
			return "";
	}
}

export function parseDate(dateStr: string) {
	if (dateStr.length !== 10) return null;

	let [day, month, year] = dateStr.split("/").map(Number);

	if (month > 12) {
		month = 12;
	}

	if (day > 31) {
		day = 31;
	}

	const date = new Date(year, month - 1, day);

	return date;
}

export function getDaysGrid(date: Date, locale = "en", delimiter = "/") {
	console.time("getDaysGrid");
	const dateMonth = date.getMonth();
	const dateYear = date.getFullYear();

	const prevMonth = dateMonth === 0 ? 11 : dateMonth - 1;
	const nextMonth = dateMonth === 11 ? 0 : dateMonth + 1;

	const lastDayInMonth = new Date(
		new Date(dateMonth === 11 ? dateYear + 1 : dateYear, nextMonth, 1).getTime() -
			1000 * 60
	).getDate();

	const lastDayInPrevMonth = new Date(
		new Date(dateMonth === 11 ? dateYear + 1 : dateYear, dateMonth, 1).getTime() -
			1000 * 60
	).getDate();

	const days: any[] = [];

	for (let i = 1; i <= lastDayInMonth; i++) {
		const d = new Date(dateYear, dateMonth, i);
		days.push({
			date: d,
			dateStr: d
				.toLocaleDateString(locale)
				.replaceAll(/[-/.@#$%^&*|;:\s]/g, delimiter),
			weekDay: d.getDay(),
			day: i,
		});
	}

	let firstRowOffset = days[0].weekDay;
	let lastRowOffset = 6 - days.at(-1).weekDay;

	const initialDaysFromNextMonth: any[] = [];
	let initialDay = 1;

	while (lastRowOffset > 0) {
		const nextDate = new Date(
			dateMonth === 11 ? dateYear + 1 : dateYear,
			nextMonth,
			initialDay
		);

		initialDaysFromNextMonth.push({
			date: nextDate,
			dateStr: nextDate
				.toLocaleDateString(locale)
				.replaceAll(/[-/.@#$%^&*|;:\s]/g, delimiter),
			weekday: nextDate.getDay(),
			day: initialDay,
		});

		initialDay++;
		lastRowOffset--;
	}

	const lastDaysFromPrevMonth: any[] = [];
	let lastDay = lastDayInPrevMonth;

	while (firstRowOffset > 0) {
		const prevDate = new Date(
			dateMonth === 0 ? dateYear - 1 : dateYear,
			prevMonth,
			lastDay
		);

		lastDaysFromPrevMonth.unshift({
			date: prevDate,
			dateStr: prevDate
				.toLocaleDateString(locale)
				.replaceAll(/[-/.@#$%^&*|;:\s]/g, delimiter),
			weekday: prevDate.getDay(),
			day: lastDay,
		});

		--lastDay;
		--firstRowOffset;
	}

	// console.log({ lastDaysFromPrevMonth, initialDaysFromNextMonth });

	// get last days from previous month
	const res = [...lastDaysFromPrevMonth, ...days, ...initialDaysFromNextMonth];
	console.timeEnd("getDaysGrid");

	return res;
}

export const isSameDate = (d: Date, selectedDate: Date) =>
	new Date(d.setHours(0, 0, 0)).getTime() ===
	new Date(selectedDate.setHours(0, 0, 0)).getTime();

export const isCurrentMonth = (d: Date, selectedDate: Date) =>
	d.getMonth() === selectedDate.getMonth();
