import { GetGroupById } from "../../../domain/usecase/account/get-group-by-id";
import { RoleModel } from "../../../domain/usecase/model";
import { GetRoleByidRepository } from "./protocols";

export class DbGetGroupById implements GetGroupById{
    constructor(
        private readonly getRoleByIdRepository: GetRoleByidRepository,
    ){}

    getById = async (id: number): Promise<RoleModel | null> => {
        const roleFinded = await this.getRoleByIdRepository.getById(id)
        return roleFinded
    }
}