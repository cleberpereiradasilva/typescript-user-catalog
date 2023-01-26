import { Entity, PrimaryGeneratedColumn, Column, Generated, ManyToMany } from "typeorm"

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Generated("uuid")
    uuid: string

    @Column({unique: true})
    description: string

}