import { RoleModel } from "../model";
export interface GetRoleById{
    getById: (id: number) => Promise<RoleModel | null>
}