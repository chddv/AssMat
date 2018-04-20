export {}
declare global {
    interface Date {
        getWeek(): number; // get week number from the "current" date
        getMonday(): Date; // get first day of the week number from the "current" date
        getSunday(): Date; // get first day of the week number from the "current" date
    }
}

Date.prototype.getWeek = function (): number
{
    var onejan = new Date(this.getFullYear(), 0, 1);
    var today =  new Date(this.getFullYear(), this.getMonth() ,this.getDate());
    var dayOfYear = ((today.valueOf() - onejan.valueOf() +1)/86400000);
    return Math.ceil(dayOfYear/7)
};

Date.prototype.getMonday = function(): Date
{
    let day: number = this.getDay();
    let diff: number = this.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(new Date(this).setDate(diff));
}

Date.prototype.getSunday = function(): Date
{
    let day: number = this.getDay();  // getDay : return 0 - 6 0=sunday, 6=Saturday
    let diff: number = this.getDate() + (7 - (day == 0 ? 7 : day));
    return new Date(new Date(this).setDate(diff));
}