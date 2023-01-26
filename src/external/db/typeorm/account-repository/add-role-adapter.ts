import { DataSource, Repository } from "typeorm";
import { AddRoleRepository } from "../../../../data/usecase/account/protocols";
import { RoleData } from "../../../../domain/usecase/account/type";
import { RoleModel } from "../../../../domain/usecase/model";
import { Role } from "../entity/role";

export class AddRoleAdapter implements AddRoleRepository{
    private repository: Repository<Role>;
    constructor(connection: DataSource){
        this.repository =  connection.getRepository(Role);
    }
    insert = async (rouleData: RoleData): Promise<RoleModel> => {
        const newRole = await this.repository.create({...rouleData})
        const insertedRole = await this.repository.save(newRole)
        const roleModel: RoleModel = {...insertedRole}
        return roleModel;
    }
}