import { Entity, PrimaryGeneratedColumn, Column, Generated, ManyToMany, JoinTable } from "typeorm"
import { Group } from "./group"

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Generated("uuid")
    uuid: string

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    password: string

    @ManyToMany(() => Group, {onDelete: 'CASCADE'})
    @JoinTable()
    groups: Group[]

}