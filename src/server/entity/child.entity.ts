import {Entity, Column, PrimaryGeneratedColumn, Index, OneToMany} from "typeorm";
import {TimeSlot} from "../entity/timeslot.entity";

@Entity()
@Index(["firstname", "familyname"], { unique: true })
export class Child {

    public static readonly DefaultTimeZone: string = 'Europe/Paris';
    public static readonly DefaultLang: string = 'fr';

    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        length: 255
    })
    familyname: string;
    @Column({
        length: 255
    })
    firstname: string;

    @OneToMany(type => TimeSlot, timeslot => timeslot.child) 
    timeslots: TimeSlot[];

}