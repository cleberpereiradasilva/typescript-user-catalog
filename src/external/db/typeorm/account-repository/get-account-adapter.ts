import { DataSource, EntityMetadataNotFoundError, Repository } from "typeorm";
import { GetAccountByEmailRepository } from "../../../../data/usecase/account/protocols";
import { AccountModel } from "../../../../domain/usecase/model";
import { Account } from "../entity/account";

export class GetAccountAdapter implements GetAccountByEmailRepository{
    private repository: Repository<Account>;
    constructor(private readonly connection: DataSource){
        this.repository =  this.connection.getRepository(Account);
    }
    getAccountByEmail = async (email: string): Promise<AccountModel> => {
        return this.repository.findOne({ where: { email: email} })
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