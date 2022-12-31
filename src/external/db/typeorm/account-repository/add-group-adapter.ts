import { DataSource, Repository } from "typeorm";
import { AddGroupRepository } from "../../../../data/usecase/account/protocols";
import { GroupData } from "../../../../domain/usecase/account/type";
import { GroupModel } from "../../../../domain/usecase/model";
import { Group } from "../entity/group";

export class AddGroupAdapter implements AddGroupRepository{
    private repository: Repository<Group>;
    constructor(connection: DataSource){
        this.repository =  connection.getRepository(Group);
    }
    insert = async (group: GroupData): Promise<GroupModel | null> => {
        const newGroup = this.repository.create({...group})
        const insertedGroup = await this.repository.save(newGroup)
        const groupModel: GroupModel = {...insertedGroup}
        return groupModel;
    }
}