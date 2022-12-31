import { DbAddGroup } from "../../data/usecase/account/db-add-group";
import { AddGroupAdapter } from "../../external/db/typeorm/account-repository/add-group-adapter";
import { AppDataSource } from "../../external/db/typeorm/db";
import { AddGroupController } from "../../presentation/controller/account/group-controller";
import { Controller } from "../../presentation/controller/protocols/interface";

export const makeAddGroupController = (): Controller => {
    const addGroupAdapter = new AddGroupAdapter(AppDataSource.manager.connection)
    const addGroup = new DbAddGroup(addGroupAdapter)
    const groupController = new AddGroupController(addGroup)
    return groupController
}