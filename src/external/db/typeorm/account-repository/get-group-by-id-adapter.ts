import { DataSource, EntityMetadataNotFoundError, Repository } from "typeorm";
import { GetGroupByidRepository } from "../../../../data/usecase/account/protocols";
import { GroupModel } from "../../../../domain/usecase/model";
import { Group } from "../entity/group";

export class GetGroupByIdAdapter implements GetGroupByidRepository{
    private repository: Repository<Group>;
    constructor(connection: DataSource){
        this.repository =  connection.getRepository(Group);
    }
    getById = async (id: number): Promise<GroupModel> => {
        return this.repository.findOne({ relations: ['roles'], where: { id: id} })
            .then(result => {
                return result
            })
            .catch(error => {
                if(error instanceof EntityMetadataNotFoundError){
                    return null
                }else{
                    return error
                }
            })
    }
}