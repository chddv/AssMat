import {Entity, Column, PrimaryGeneratedColumn, Index} from "typeorm";

@Entity()
@Index(["firstname", "familyname"], { unique: true })
export class Child {
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
}