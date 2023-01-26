import { GroupModel, RoleModel } from "../model";
export interface AddRoleToGroup{
    addRole: (group: GroupModel, roles: RoleModel[]) => Promise<GroupModel | null>
}