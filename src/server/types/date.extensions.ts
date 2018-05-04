export {}
declare global {
    interface Date {
        getWeek(): number; // get week number from the "current" date
        getMonday(): Date; // get first day of the week number from the "current" date
        getSunday(): Date; // get first day of the week number from the "current" date
        addDays(nbDay: number);
        clone(): Date;
        setToMidnight(): Date; 
        getDayName(): string;
        getShortDayName(): string;
        getMonthName(): string;
        getShortMonthName(): string;
        isSameDay(aDay: Date): Boolean;
    }
}

const DayNames: string[] = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const ShortDayNames: string[] = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];
const MonthNames: string[] = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "aout", "septembre", "octobre", "novembre", "décembre"];
const ShortMonthNames: string[] = ["jan", "fév", "mars", "avr", "mai", "jui", "juil", "aout", "sept", "oct", "nov", "déc"];

Date.prototype.getWeek = function (): number
{
    var onejan = new Date(this.getFullYear(), 0, 1);
    var today =  new Date(this.getFullYear(), this.getMonth() ,this.getDate());
    var dayOfYear = ((today.valueOf() - onejan.valueOf() +1)/86400000);
    return Math.ceil(dayOfYear/7); 
};

Date.prototype.getMonday = function(): Date
{
    let day: number = this.getDay();
    let diff: number = this.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(this.clone().setDate(diff));
}

Date.prototype.getSunday = function(): Date
{
    let day: number = this.getDay();  // getDay : return 0 - 6 0=sunday, 6=Saturday
    let diff: number = this.getDate() + (7 - (day == 0 ? 7 : day));
    return new Date(this.clone().setDate(diff));
}

Date.prototype.addDays = function(nbDay: number)
{
    this.setDate(this.getDate() + 1);
}

Date.prototype.clone = function()
{
    return new Date(this.getTime());
}

Date.prototype.setToMidnight = function()
{
    return this.setUTCHours(0,0,0,0);
}

Date.prototype.getDayName = function(): string
{
    return DayNames[this.getDay()];
}

Date.prototype.getShortDayName = function(): string
{
    return ShortDayNames[this.getDay()];
}

Date.prototype.getMonthName = function(): string
{
    return MonthNames[this.getMonth()];
}

Date.prototype.getShortMonthName = function(): string
{
    return ShortMonthNames[this.getMonth()];
}

Date.prototype.isSameDay = function(aDay: Date): Boolean
{
    if(aDay.getDate() == this.getDate() && 
       aDay.getMonth() == this.getMonth() &&
       aDay.getFullYear() == this.getFullYear())
    {
        return true;
    }
    else
    {
        return false;
    }
}