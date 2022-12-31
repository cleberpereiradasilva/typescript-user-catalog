import { AddGroup } from "../../../domain/usecase/account";
import { GroupData } from "../../../domain/usecase/account/type";
import { GroupModel } from "../../../domain/usecase/model";
import { AddGroupRepository } from "./protocols";

export class DbAddGroup implements AddGroup{
    constructor(
        private readonly addGroupRepository: AddGroupRepository,
    ){}

    add = async (groupData: GroupData): Promise<GroupModel | null> => {
        const newAccount = await this.addGroupRepository.insert(groupData)
        return newAccount
    }
}