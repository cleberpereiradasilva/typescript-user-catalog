import { GroupModel, RoleModel } from "../../../../domain/usecase/model";

export interface AddRoleToGroupRepository{
    addRole: (group: GroupModel, role: RoleModel[]) => Promise<GroupModel>
}