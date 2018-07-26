import {Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne} from "typeorm";
import {Child} from "../entity/child.entity";
import {Moment} from "moment-timezone"

@Entity()
export class TimeSlot {

    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(type => Child, child => child.timeslots)
    child: Child;

    //TODO: replace four hour and minute with enum (wait version 0.2)
    @Column("int")
    startHour: number;    
    @Column("int")
    startMinute: number;

    @Column("int")
    endHour: number;
    @Column("int")
    endMinute: number;

    // day concerned the timeslot
    @Column()
    monday: boolean;
    @Column()
    tuesday: boolean;
    @Column()
    wednesday: boolean;
    @Column()
    thursday: boolean;
    @Column()
    friday: boolean;
    @Column()
    saturday: boolean;
    @Column()
    sunday: boolean;
    @Column()
    holiday: boolean;
    @Column()
    nonworkingday: boolean; // jour férié

    // retourn vrai si le timeslot correspond a dtDay
    /*isValidFor(dtDay: Date): boolean
    {
        //TODO: Detect if a day is an holiday, or a nonworking day        
        let bDayIsHoliday = false && this.holiday;
        let bDayIsNonWorkingDay = false && this.nonworkingday;

        let bWeekDayOK = 
            (dtDay.getDay() == 0 && this.sunday)    ||
            (dtDay.getDay() == 1 && this.monday)    ||
            (dtDay.getDay() == 2 && this.tuesday)   ||
            (dtDay.getDay() == 3 && this.wednesday) ||
            (dtDay.getDay() == 4 && this.thursday)  ||
            (dtDay.getDay() == 5 && this.friday)    ||
            (dtDay.getDay() == 6 && this.saturday); 

        return bWeekDayOK || bDayIsHoliday || bDayIsNonWorkingDay;
    }*/

    isValidForMoment(_dtDay: Moment): boolean
    {
        //TODO: Detect if a day is an holiday, or a nonworking day        
        let bDayIsHoliday = false && this.holiday;
        let bDayIsNonWorkingDay = false && this.nonworkingday;

        let bWeekDayOK = 
            (_dtDay.day() == 0 && this.sunday)    ||
            (_dtDay.day() == 1 && this.monday)    ||
            (_dtDay.day() == 2 && this.tuesday)   ||
            (_dtDay.day() == 3 && this.wednesday) ||
            (_dtDay.day() == 4 && this.thursday)  ||
            (_dtDay.day() == 5 && this.friday)    ||
            (_dtDay.day() == 6 && this.saturday); 

        return bWeekDayOK || bDayIsHoliday || bDayIsNonWorkingDay;
    }


    /*
    get presence() :number
    { 
        return (this.monday        ? 1   : 0) +
        (this.tuesday       ? 2   : 0) +
        (this.wednesday     ? 4   : 0) +
        (this.thursday      ? 8   : 0) +
        (this.friday        ? 16  : 0) +  
        (this.saturday      ? 32  : 0) +  
        (this.sunday        ? 64  : 0) +  
        (this.holiday       ? 128 : 0) +  
        (this.nonworkingday ? 256 : 0);
    }

    set presence(_presence: number)
    {
        this.monday        = (_presence & 1) > 0;
        this.tuesday       = (_presence & 2) > 0;
        this.wednesday     = (_presence & 4) > 0;
        this.thursday      = (_presence & 8) > 0;
        this.friday        = (_presence & 16) > 0;
        this.saturday      = (_presence & 32) > 0;
        this.sunday        = (_presence & 64) > 0;
        this.holiday       = (_presence & 128) > 0;
        this.nonworkingday = (_presence & 256) > 0;
    }
    */

}