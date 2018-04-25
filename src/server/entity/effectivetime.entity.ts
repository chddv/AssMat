import {Entity, Column, ColumnType, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn} from "typeorm";
import {Child} from "../entity/child.entity";

@Entity()
export class EffectiveTime {

    constructor(_dtstart: Date, _dtend: Date, _oChild: Child)
    {
        this.dtstart = _dtstart;
        this.dtend = _dtend;
        this.child = _oChild;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "timestamp"
    })
    dtstart: Date; // day when the event happen

    @Column({
        type: "timestamp"
    })
    dtend: Date; // day when the event happen

    @OneToOne(type => Child) 
    @JoinColumn()
    child: Child;

    static sortByHourTime(t1: EffectiveTime, t2: EffectiveTime): number
    { 
        if(t1.dtstart < t2.dtend)
        {
            return -1;
        }
        else if(t1.dtstart > t2.dtend)
        {
            return 1;
        }
        else 
        {
            return 0;
        }
    }

    isStrictAfter(_aTime: EffectiveTime)
    {
        if (this.dtstart > _aTime.dtend)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    isAfter(_aTime: EffectiveTime)
    {
        if (this.dtend > _aTime.dtend)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

}