import {Entity, Column, ColumnType, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn} from "typeorm";
import {Child} from "../entity/child.entity";

@Entity()
export class EffectiveTime {

    constructor(_startDate: Date, _endDate: Date, _oChild: Child)
    {
        this.startDate = _startDate;
        this.endDate = _endDate;
        this.child = _oChild;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "timestamp"
    })
    startDate: Date; // day when the event happen

    @Column({
        type: "timestamp"
    })
    endDate: Date; // day when the event happen

    @OneToOne(type => Child) 
    @JoinColumn()
    child: Child;

    static sortByHourTime(t1: EffectiveTime, t2: EffectiveTime): number
    { 
        if(t1.startDate < t2.startDate)
        {
            return -1;
        }
        else if(t1.startDate > t2.startDate)
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
        if (this.startDate > _aTime.endDate)
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
        if (this.endDate > _aTime.endDate)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

}