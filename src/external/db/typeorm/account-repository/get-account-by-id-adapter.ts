import { DataSource, EntityMetadataNotFoundError, Repository } from "typeorm";
import { GetAccountByIdRepository } from "../../../../data/usecase/account/protocols";
import { AccountModel } from "../../../../domain/usecase/model";
import { Account } from "../entity/account";

export class GetAccountByIdAdapter implements GetAccountByIdRepository{
    private repository: Repository<Account>;
    constructor(private readonly connection: DataSource){
        this.repository =  this.connection.getRepository(Account);
    }
    getAccountById = async (id: number): Promise<AccountModel> => {
        return this.repository.findOne({ where: { id: id} })
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