import { RoleModel } from "./role-model";
export interface GroupModel{
    id: number;
    uuid: string;
    description: string;
    roles?: RoleModel[]
}