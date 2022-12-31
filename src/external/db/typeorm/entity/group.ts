import { Entity, PrimaryGeneratedColumn, Column, Generated } from "typeorm"

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Generated("uuid")
    uuid: string

    @Column()
    description: string

}