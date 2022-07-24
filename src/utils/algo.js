console.clear();

const date = new Date(new Date(2022,1,1).setFullYear(19))

 /**
  * takes a date and returns its string scheme representation respecting locale and delimiter
  * @param {Date | null} d whatever date
  * @param {string | null | undefined} locale locale code
  * @param {string | null | undefined} delimiter delimiter token
  * @return {string} locale date string representation. Ex: M/D/Y, D.M.Y, Y-M-D etc.
  */
export function getDateFormat(d, locale, delimiter) {
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
       yearlessSplit
  
  
  if (!d) return ''

  locale = locale ? locale : 'en'; // falsy or invalid defaults to en
  
  localeDate = d.toLocaleDateString(locale);
  delimiter = delimiter ? delimiter : localeDate.replace(/\d/g, "")[0];
  
  formattedDate = localeDate.replace(/\D/g, delimiter);
  
  splitDate = formattedDate.split(delimiter).map(Number);
  
  dayA = d.getDate();
  monthA = d.getMonth() + 1;
  month = splitDate.find(_d =>_d === monthA);
  day = splitDate.find(_d =>_d === dayA);
  year = d.getFullYear()
  
  dayIndex = splitDate.findIndex(v => v === day)
  monthIndex = splitDate.findIndex(v => v === month)
  yearIndex = splitDate.findIndex(v => v === year)
  
  if (day === month) {
    // compare to another date and find out who's month and who's day
    dateB = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate());
    testDate = dateB.toLocaleDateString(locale); // date + 1 month
    formattedTestDate = testDate.replace(/\D/g, delimiter);
    splitTestDate = formattedTestDate.split(delimiter)
    
    yearlessSplit = splitTestDate.filter(d => d.length !== 4).map(Number);
    notMonth = yearlessSplit.find(d => d !== month);
    
    month = yearlessSplit.find(d => d !== notMonth);
    
    monthIndex = yearIndex === 0 ? yearlessSplit.findIndex(v => v === notMonth) + 1 : yearlessSplit.findIndex(v => v === notMonth)
    dayIndex = yearIndex === 0 ? yearlessSplit.findIndex(v => v !== notMonth) + 1 :  yearlessSplit.findIndex(v => v !== notMonth);
    
  }
  

  const dateSchema = []
  const schema = {
    [dayIndex]: 'D', 
    [monthIndex]: 'M', 
    [yearIndex]: 'Y', 
  }
  
  for (let i = 0; i < 3; i++) {
      dateSchema.push(schema[i]);
    if (i < 2) {
        dateSchema.push(delimiter);
    }  
  }

  
  return dateSchema.join('')
  
  
  
  
  

}


// console.log(getDateFormat(date, 'pt-BR'))
// console.log(getDateFormat(date, 'jpn', ' '))
// console.log(getDateFormat(date, 'de'))
// console.log(getDateFormat(date)) // us
// getDateFormat(date, undefined, '#')
// checkDateFormat(date, 'it', '&')
// checkDateFormat(date, 'hdsfhw', '~')
