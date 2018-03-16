import {Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne} from "typeorm";
import {Child} from "../entity/child.entity";

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

}