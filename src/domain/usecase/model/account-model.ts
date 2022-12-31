import { Group } from "../../../external/db/typeorm/entity/group";

export interface AccountModel{
    id: number;
    uuid: string;
    name: string;
    email: string;
    password: string; 
    groups: Group[]
}