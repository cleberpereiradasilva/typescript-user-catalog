import { DataSource, Repository } from "typeorm";
import { AddRoleToGroup } from "../../../../domain/usecase/account/add-role-to-group";
import { GroupModel, RoleModel } from "../../../../domain/usecase/model";
import { Group } from "../entity/group";

export class AddRoleToGroupAdapter implements AddRoleToGroup{
    private repository: Repository<Group>;
    constructor(connection: DataSource){
        this.repository =  connection.getRepository(Group);
    }
    addRole = async (group: GroupModel, roles: RoleModel[]): Promise<GroupModel> => {
        group.roles = (group.roles || []).concat(roles)
        const groupWithRoles = await this.repository.save(group)
        const groupModel: GroupModel = {...groupWithRoles}
        return groupModel;
    }
}