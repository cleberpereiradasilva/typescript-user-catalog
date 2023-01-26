import { RoleData } from "../../../../domain/usecase/account/type";
import { RoleModel } from "../../../../domain/usecase/model";

export interface AddRoleRepository{
    insert: (roleData: RoleData) => Promise<RoleModel | null>
}