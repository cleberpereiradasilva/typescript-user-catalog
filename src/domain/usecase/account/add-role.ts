import { RoleModel } from "../model";
import { RoleData } from "./type";
export interface AddRole{
    add: (roleData: RoleData) => Promise<RoleModel>
}