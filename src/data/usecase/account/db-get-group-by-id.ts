import { GetGroupById } from "../../../domain/usecase/account/get-group-by-id";
import { GroupModel } from "../../../domain/usecase/model";
import { GetGroupByIdRepository } from "./protocols";

export class DbGetGroupById implements GetGroupById{
    constructor(
        private readonly getGroupByIdRepository: GetGroupByIdRepository,
    ){}

    getById = async (id: number): Promise<GroupModel | null> => {
        const newAccount = await this.getGroupByIdRepository.getById(id)
        return newAccount
    }
}