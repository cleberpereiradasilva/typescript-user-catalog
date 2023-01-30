import { DbAddGroup } from "../../data/usecase/account/db-add-group";
import { DbAddRoleToGroup } from "../../data/usecase/account/db-add-role-to-group";
import { AddGroupAdapter } from "../../external/db/typeorm/account-repository/add-group-adapter";
import { AddRoleToGroupAdapter } from "../../external/db/typeorm/account-repository/add-role-to-group-adapter";
import { AppDataSource } from "../../external/db/typeorm/db";
import { AddGroupController } from "../../presentation/controller/account/group-controller";
import { Controller } from "../../presentation/controller/protocols/interface";

export const makeAddRolesToGroupController = (): Controller => {
    const addRolesToGroupAdapter = new AddRoleToGroupAdapter(AppDataSource.manager.connection)
    const addRolesToGroup = new DbAddRoleToGroup(addRolesToGroupAdapter)
    const groupController = new AddGroupController(addGroup)
    return groupController
}