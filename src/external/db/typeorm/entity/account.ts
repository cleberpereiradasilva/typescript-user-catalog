import { Entity, PrimaryGeneratedColumn, Column, Generated } from "typeorm"

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

}