import { AddRoleToGroup } from "../../../domain/usecase/account/add-role-to-group";
import { GroupModel, RoleModel } from "../../../domain/usecase/model";
import { AddRoleToGroupRepository } from "./protocols";

export class DbAddRoleToGroup implements AddRoleToGroup{
    constructor(
        private readonly addRoleToGroupRepository: AddRoleToGroupRepository,
    ){}
    addRole = async (group: GroupModel, roles: RoleModel[]): Promise<GroupModel | null> => {
        const groupWithRole = await this.addRoleToGroupRepository.addRole(group, roles)
        return groupWithRole
    }
}