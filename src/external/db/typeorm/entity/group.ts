import { Entity, PrimaryGeneratedColumn, Column, Generated, ManyToMany, JoinTable } from "typeorm"
import { Role } from "./role"

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Generated("uuid")
    uuid: string

    @Column({unique: true})
    description: string

    
    @ManyToMany(() => Role)
    @JoinTable()
    roles?: Role[]

}