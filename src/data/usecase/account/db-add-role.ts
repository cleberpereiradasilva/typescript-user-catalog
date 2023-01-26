import { AddRole } from "../../../domain/usecase/account";
import { RoleData } from "../../../domain/usecase/account/type";
import { RoleModel } from "../../../domain/usecase/model";
import { AddRoleRepository } from "./protocols";

export class DbAddRole implements AddRole{
    constructor(
        private readonly addRoleRepository: AddRoleRepository,
    ){}

    add = async (rouleData: RoleData): Promise<RoleModel> => {
        const newRole = await this.addRoleRepository.insert(rouleData)
        return newRole
    }
}