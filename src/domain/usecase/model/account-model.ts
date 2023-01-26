import { GroupModel } from './group-model'

export interface AccountModel{
    id: number;
    uuid: string;
    name: string;
    email: string;
    password: string; 
    groups: GroupModel[]
}