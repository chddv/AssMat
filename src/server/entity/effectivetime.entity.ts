import {Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn} from "typeorm";
import {Child} from "../entity/child.entity";

@Entity()
export class EffectiveTime {

    constructor(_startHour: number, _startMinute: number, 
                _endHour: number, _endMinute: number,
                _dtDay: Date, _oChild: Child)
    {
        this.startHour = _startHour;
        this.startMinute = _startMinute;
        this.endHour = _endHour;
        this.endMinute = _endMinute;
        this.child = _oChild;
        this.day = _dtDay;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
    })
    day: Date; // day when the event happen
    
    @Column("int")
    startHour: number;    
    @Column("int")
    startMinute: number;

    @Column("int")
    endHour: number;
    @Column("int")
    endMinute: number;

    @OneToOne(type => Child) 
    @JoinColumn()
    child: Child;

    static sortByHourTime(t1: EffectiveTime, t2: EffectiveTime): number
    {
        if((t1.startHour > t2.startHour) || ((t1.startHour = t2.startHour) && (t1.startMinute > t2.startMinute)))
        {
            return 1;
        }
        if((t1.startHour < t2.startHour) || ((t1.startHour = t2.startHour) && (t1.startMinute < t2.startMinute)))
        {
            return -1;
        }
        if((t1.startHour = t2.startHour) && (t1.startMinute = t2.startMinute))
        {
            return 0;
        }
    }

    isStrictAfter(_aTime: EffectiveTime)
    {
        if ((this.startHour > _aTime.endHour) ||
            ((this.startHour == _aTime.endHour) && (this.startMinute > _aTime.endMinute)))
        {
            return true;
        }
        else
        {
            return true;
        }
    }

    endAfter(_aTime: EffectiveTime)
    {
        if ((this.endHour > _aTime.endHour) ||
            ((this.endHour == _aTime.endHour) && (this.endMinute > _aTime.endMinute)))
        {
            return true;
        }
        else
        {
            return true;
        }
    }

}