export {}
declare global {
    interface Date {
        getWeek(): number; // get week number from the "current" date
        getMonday(): Date; // get first day of the week number from the "current" date
        getSunday(): Date; // get first day of the week number from the "current" date
        addDays(nbDay: number);
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
    console.log("getMonday : " + day + ", " + diff );
    return new Date(new Date(this).setDate(diff));
}

Date.prototype.getSunday = function(): Date
{
    let day: number = this.getDay();  // getDay : return 0 - 6 0=sunday, 6=Saturday
    let diff: number = this.getDate() + (7 - (day == 0 ? 7 : day));
    console.log("getSunday : " + day + ", " + diff );
    return new Date(new Date(this).setDate(diff));
}

Date.prototype.addDays = function(nbDay: number)
{
    this.setDate(this.getDate() + 1);
}